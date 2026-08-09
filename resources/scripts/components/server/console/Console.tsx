import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ITerminalOptions, Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';
import { SearchBarAddon } from 'xterm-addon-search-bar';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { ScrollDownHelperAddon } from '@/plugins/XtermScrollDownHelperAddon';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { ServerContext } from '@/state/server';
import { usePermissions } from '@/plugins/usePermissions';
import { theme as th } from 'twin.macro';
import useEventListener from '@/plugins/useEventListener';
import { debounce } from 'debounce';
import { usePersistedState } from '@/plugins/usePersistedState';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import classNames from 'classnames';
import { ChevronDoubleRightIcon } from '@heroicons/react/solid';

import 'xterm/css/xterm.css';
import styles from './style.module.css';

const theme = {
    background: 'rgba(15, 10, 10, 0.95)',
    cursor: '#f58529',
    black: '#140a0a',
    red: '#ff3333',
    green: '#00ff88',
    yellow: '#ffff00',
    blue: '#8134af',
    magenta: '#dd2a7b',
    cyan: '#f58529',
    white: '#d0d0d0',
    brightBlack: 'rgba(245, 133, 41, 0.3)',
    brightRed: '#ff6666',
    brightGreen: '#33ff99',
    brightYellow: '#ffff66',
    brightBlue: '#8134af',
    brightMagenta: '#dd2a7b',
    brightCyan: '#f58529',
    brightWhite: '#ffffff',
    selection: 'rgba(245, 133, 41, 0.3)',
};

const terminalProps: ITerminalOptions = {
    disableStdin: true,
    cursorStyle: 'underline',
    allowTransparency: true,
    fontSize: 12,
    fontFamily: th('fontFamily.mono'),
    rows: 30,
    theme: theme,
};

export default () => {
    const TERMINAL_PRELUDE = '\u001b[1m\u001b[33mcontainer@pterodactyl~ \u001b[0m';
    const ref = useRef<HTMLDivElement>(null);
    const terminal = useMemo(() => new Terminal({ ...terminalProps }), []);
    const fitAddon = new FitAddon();
    const searchAddon = new SearchAddon();
    const searchBar = new SearchBarAddon({ searchAddon });
    const webLinksAddon = new WebLinksAddon();
    const scrollDownHelperAddon = new ScrollDownHelperAddon();
    const { connected, instance } = ServerContext.useStoreState((state) => state.socket);
    const [canSendCommands] = usePermissions(['control.console']);
    const serverId = ServerContext.useStoreState((state) => state.server.data!.id);
    const serverName = ServerContext.useStoreState((state) => state.server.data!.name);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const [history, setHistory] = usePersistedState<string[]>(`${serverId}:command_history`, []);
    const [historyIndex, setHistoryIndex] = useState(-1);
    // SearchBarAddon has hardcoded z-index: 999 :(
    const zIndex = `
    .xterm-search-bar__addon {
        z-index: 10;
    }`;

    const handleConsoleOutput = (line: string, prelude = false) =>
        terminal.writeln((prelude ? TERMINAL_PRELUDE : '') + line.replace(/(?:\r\n|\r|\n)$/im, '') + '\u001b[0m');

    const handleTransferStatus = (status: string) => {
        switch (status) {
            // Sent by either the source or target node if a failure occurs.
            case 'failure':
                terminal.writeln(TERMINAL_PRELUDE + 'Transfer has failed.\u001b[0m');
                return;
        }
    };

    const handleDaemonErrorOutput = (line: string) =>
        terminal.writeln(
            TERMINAL_PRELUDE + '\u001b[1m\u001b[41m' + line.replace(/(?:\r\n|\r|\n)$/im, '') + '\u001b[0m'
        );

    const handlePowerChangeEvent = (state: string) =>
        terminal.writeln(TERMINAL_PRELUDE + 'Server marked as ' + state + '...\u001b[0m');

    const handleCommandKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            const newIndex = Math.min(historyIndex + 1, history!.length - 1);

            setHistoryIndex(newIndex);
            e.currentTarget.value = history![newIndex] || '';

            // By default up arrow will also bring the cursor to the start of the line,
            // so we'll preventDefault to keep it at the end.
            e.preventDefault();
        }

        if (e.key === 'ArrowDown') {
            const newIndex = Math.max(historyIndex - 1, -1);

            setHistoryIndex(newIndex);
            e.currentTarget.value = history![newIndex] || '';
        }

        const command = e.currentTarget.value;
        if (e.key === 'Enter' && command.length > 0) {
            setHistory((prevHistory) => [command, ...prevHistory!].slice(0, 32));
            setHistoryIndex(-1);

            instance && instance.send('send command', command);
            e.currentTarget.value = '';
        }
    };

    useEffect(() => {
        if (connected && ref.current && !terminal.element) {
            terminal.loadAddon(fitAddon);
            terminal.loadAddon(searchAddon);
            terminal.loadAddon(searchBar);
            terminal.loadAddon(webLinksAddon);
            terminal.loadAddon(scrollDownHelperAddon);

            terminal.open(ref.current);
            fitAddon.fit();
            searchBar.addNewStyle(zIndex);

            // Add support for capturing keys
            terminal.attachCustomKeyEventHandler((e: KeyboardEvent) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                    document.execCommand('copy');
                    return false;
                } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                    e.preventDefault();
                    searchBar.show();
                    return false;
                } else if (e.key === 'Escape') {
                    searchBar.hidden();
                }
                return true;
            });
        }
    }, [terminal, connected]);

    useEventListener(
        'resize',
        debounce(() => {
            if (terminal.element) {
                fitAddon.fit();
            }
        }, 100)
    );

    useEffect(() => {
        const listeners: Record<string, (s: string) => void> = {
            [SocketEvent.STATUS]: handlePowerChangeEvent,
            [SocketEvent.CONSOLE_OUTPUT]: handleConsoleOutput,
            [SocketEvent.INSTALL_OUTPUT]: handleConsoleOutput,
            [SocketEvent.TRANSFER_LOGS]: handleConsoleOutput,
            [SocketEvent.TRANSFER_STATUS]: handleTransferStatus,
            [SocketEvent.DAEMON_MESSAGE]: (line) => handleConsoleOutput(line, true),
            [SocketEvent.DAEMON_ERROR]: handleDaemonErrorOutput,
        };

        if (connected && instance) {
            // Do not clear the console if the server is being transferred.
            if (!isTransferring) {
                terminal.clear();
            }

            Object.keys(listeners).forEach((key: string) => {
                instance.addListener(key, listeners[key]);
            });
            instance.send(SocketRequest.SEND_LOGS);
        }

        return () => {
            if (instance) {
                Object.keys(listeners).forEach((key: string) => {
                    instance.removeListener(key, listeners[key]);
                });
            }
        };
    }, [connected, instance]);

    const onClear = () => {
        if (terminal.element) terminal.clear();
    };

    const onToggleSearch = () => {
        // SearchBarAddon doesn't expose state, just toggle behaviors
        // Show the bar if hidden; hide if visible by triggering Escape
        // We rely on a simple heuristic: try show(), then blur to hide
        try {
            if (searchBar && searchBar.show) {
                searchBar.show();
            }
        } catch {
            return;
        }
    };

    // const onScrollBottom = () => {
    //     if (terminal.element) terminal.scrollToBottom();
    // };

    return (
        <div className={classNames(styles.terminal, 'relative')}>
            <SpinnerOverlay visible={!connected} size={'large'} />
            <div
                className={classNames(styles.container, styles.overflows_container, { 'rounded-b': !canSendCommands })}
                style={{
                    backgroundColor: '#0F172A',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lg)',
                }}
            >
                <div
                    className={'flex items-center justify-between mb-4 p-4'}
                    style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderBottom: '1px solid var(--border-primary)',
                    }}
                >
                    <div className={'flex items-baseline space-x-3 min-w-0'}>
                        <h3
                            className={'text-sm font-black truncate tracking-tight'}
                            style={{
                                fontFamily: "'Raleway', sans-serif",
                                color: 'var(--text-primary)',
                            }}
                        >
                            {serverName}
                        </h3>
                        <span
                            className={'text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest'}
                            style={{
                                ...(status === 'running'
                                    ? {
                                          background: 'var(--status-success-bg)',
                                          color: 'var(--status-success-text)',
                                      }
                                    : status === 'offline'
                                    ? {
                                          background: 'var(--status-error-bg)',
                                          color: 'var(--status-error-text)',
                                      }
                                    : {
                                          background: 'var(--status-warning-bg)',
                                          color: 'var(--status-warning-text)',
                                      }),
                            }}
                        >
                            {status || 'unknown'}
                        </span>
                    </div>
                    <div className={'flex items-center space-x-2'}>
                        <button
                            onClick={onClear}
                            className={
                                'px-3 py-1.5 text-[10px] rounded-lg font-black uppercase tracking-widest transition-all duration-300'
                            }
                            style={{
                                background: 'var(--bg-tertiary)',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border-primary)',
                                fontFamily: "'Raleway', sans-serif",
                            }}
                        >
                            Clear
                        </button>
                        <button
                            onClick={onToggleSearch}
                            className={
                                'px-3 py-1.5 text-[10px] rounded-lg font-black uppercase tracking-widest transition-all duration-300'
                            }
                            style={{
                                background: 'var(--bg-tertiary)',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border-primary)',
                                fontFamily: "'Raleway', sans-serif",
                            }}
                        >
                            Find
                        </button>
                    </div>
                </div>
                <div className={'h-full px-4 pb-4'}>
                    <div id={styles.terminal} ref={ref} />
                </div>
            </div>
            {canSendCommands && (
                <div className={classNames('relative mt-4')}>
                    <input
                        className={classNames(
                            'peer w-full rounded-xl py-4 pl-12 pr-4 font-bold transition-all outline-none shadow-sm'
                        )}
                        style={{
                            backgroundColor: 'var(--bg-input)',
                            border: '1px solid var(--border-input)',
                            color: 'var(--text-primary)',
                        }}
                        type={'text'}
                        placeholder={'Type a command...'}
                        aria-label={'Console command input.'}
                        disabled={!instance || !connected}
                        onKeyDown={handleCommandKeyDown}
                        autoCorrect={'off'}
                        autoCapitalize={'none'}
                    />
                    <div
                        className={classNames(
                            'absolute left-4 top-1/2 transform -translate-y-1/2 peer-focus:text-accent-purple'
                        )}
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <ChevronDoubleRightIcon className={'w-5 h-5'} />
                    </div>
                </div>
            )}
        </div>
    );
};
