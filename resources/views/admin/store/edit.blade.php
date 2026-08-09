@extends('layouts.admin')

@section('title')
    {{ $product ? 'Edit Produk' : 'Buat Produk' }}
@endsection

@section('content-header')
    <h1>{{ $product ? 'Edit Produk' : 'Buat Produk' }}<small>Konfigurasi paket game server.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li><a href="{{ route('admin.store.index') }}">Store</a></li>
        <li class="active">{{ $product ? 'Edit' : 'Buat' }}</li>
    </ol>
@endsection

@section('content')
    <form action="{{ $product ? route('admin.store.edit', $product->id) : route('admin.store.new') }}" method="POST">
        @if($product)
            @method('PATCH')
        @endif
        <div class="row">
            <div class="col-md-6">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">Informasi Produk</h3>
                    </div>
                    <div class="box-body">
                        <div class="form-group">
                            <label class="control-label">Nama</label>
                            <input type="text" name="name" class="form-control" value="{{ old('name', $product->name ?? '') }}" required />
                        </div>
                        <div class="form-group">
                            <label class="control-label">Deskripsi</label>
                            <textarea name="description" class="form-control" rows="3">{{ old('description', $product->description ?? '') }}</textarea>
                            <p class="text-muted"><small>Tampil di halaman store client.</small></p>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Harga (sen / RM cents)</label>
                            <input type="number" name="price" class="form-control" min="0" value="{{ old('price', $product->price ?? '') }}" required />
                            <p class="text-muted"><small>Contoh: RM 10.00 = isi <code>1000</code>.</small></p>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Urutan Tampil</label>
                            <input type="number" name="sort_order" class="form-control" min="0" value="{{ old('sort_order', $product->sort_order ?? 0) }}" />
                        </div>
                        <div class="form-group">
                            <label class="control-label">Aktif</label>
                            <select name="active" class="form-control">
                                <option value="1" @if((old('active', $product->active ?? true) == true)) selected @endif>Ya</option>
                                <option value="0" @if((old('active', $product->active ?? true) == false)) selected @endif>Tidak</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">Spesifikasi Server</h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label">RAM (MB)</label>
                                    <input type="number" name="memory" class="form-control" min="16" value="{{ old('memory', $product->memory ?? '') }}" required />
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label">CPU (%)</label>
                                    <input type="number" name="cpu" class="form-control" min="0" value="{{ old('cpu', $product->cpu ?? '') }}" required />
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label">Disk (MB)</label>
                                    <input type="number" name="disk" class="form-control" min="16" value="{{ old('disk', $product->disk ?? '') }}" required />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="control-label">Swap (MB)</label>
                                    <input type="number" name="swap" class="form-control" min="0" value="{{ old('swap', $product->swap ?? 0) }}" />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="control-label">I/O</label>
                                    <input type="number" name="io" class="form-control" min="0" value="{{ old('io', $product->io ?? 500) }}" disabled />
                                    <p class="text-muted"><small>Fix di 500.</small></p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label">Backup Limit</label>
                                    <input type="number" name="backup_limit" class="form-control" min="0" value="{{ old('backup_limit', $product->backup_limit ?? 0) }}" />
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label">Database Limit</label>
                                    <input type="number" name="database_limit" class="form-control" min="0" value="{{ old('database_limit', $product->database_limit ?? 0) }}" />
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label">Allocation Limit</label>
                                    <input type="number" name="allocation_limit" class="form-control" min="1" value="{{ old('allocation_limit', $product->allocation_limit ?? 1) }}" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">Deployment</h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label">Node</label>
                                    <select name="node_id" class="form-control">
                                        <option value="">Otomatis</option>
                                        @foreach($nodes as $node)
                                            <option value="{{ $node->id }}" @if(old('node_id', $product->node_id ?? '') == $node->id) selected @endif>{{ $node->name }}</option>
                                        @endforeach
                                    </select>
                                    <p class="text-muted"><small>Kosongkan untuk pakai allocation mana pun yang tersedia.</small></p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label">Nest</label>
                                    <select name="nest_id" id="nest-select" class="form-control" required>
                                        @foreach($nests as $nest)
                                            <option value="{{ $nest->id }}" @if(old('nest_id', $product->nest_id ?? '') == $nest->id) selected @endif>{{ $nest->name }}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label">Egg</label>
                                    <select name="egg_id" id="egg-select" class="form-control" required>
                                        @foreach($eggs as $egg)
                                            <option value="{{ $egg->id }}" data-nest="{{ $egg->nest_id }}" @if(old('egg_id', $product->egg_id ?? '') == $egg->id) selected @endif>{{ $egg->name }}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">Docker Image</label>
                            <input type="text" name="image" class="form-control" value="{{ old('image', $product->image ?? 'ghcr.io/parkervcp/yolks:generic') }}" />
                        </div>
                    </div>
                    <div class="box-footer">
                        {!! csrf_field() !!}
                        <button type="submit" class="btn btn-primary pull-right">Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
@endsection

@section('footer-scripts')
    @parent
    <script>
        $(document).ready(function () {
            function filterEggs() {
                var nestId = $('#nest-select').val();
                $('#egg-select option').each(function () {
                    $(this).toggle($(this).data('nest') == nestId);
                });
                if (!$('#egg-select option:selected').is(':visible')) {
                    $('#egg-select').val($('#egg-select option:visible').first().val());
                }
            }
            $('#nest-select').change(filterEggs);
            filterEggs();
        });
    </script>
@endsection
