<?php

namespace Pterodactyl\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Pterodactyl\Models\User;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Services\Users\UserCreationService;
use Illuminate\Contracts\Auth\Guard;

class RegisterController extends Controller
{
    /**
     * RegisterController constructor.
     */
    public function __construct(
        private UserCreationService $creationService,
        private Guard $auth
    ) {
    }

    /**
     * Handle a registration request for the application.
     *
     * @throws \Throwable
     */
    public function register(Request $request): array
    {
        $this->validate($request, [
            'username' => 'required|string|between:1,191|unique:users,username',
            'email' => 'required|email|between:1,191|unique:users,email',
            'name_first' => 'required|string|between:1,191',
            'name_last' => 'required|string|between:1,191',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $this->creationService->handle([
            'username' => $request->input('username'),
            'email' => $request->input('email'),
            'name_first' => $request->input('name_first'),
            'name_last' => $request->input('name_last'),
            'password' => $request->input('password'),
            'root_admin' => false,
        ]);

        $this->auth->login($user, true);

        return [
            'success' => true,
            'data' => [
                'intended' => '/dashboard',
            ],
        ];
    }
}
