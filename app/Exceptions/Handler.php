<?php

use App\Http\Traits\ApiResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Throwable;

class Handler extends Exception
{
    use ApiResponse;

    public function invalidJson($request, ValidationException $exception)
    {
        return $this->error(
            $exception->errors(),
            'Validation Failed',
            422
        );
    }

    public function render($request, Throwable $e)
    {
        if ($request->expectsJson()) {

            if ($e instanceof AuthenticationException) {
                return $this->error([], 'Unauthenticated', 401);
            }

            if ($e instanceof AuthorizationException) {
                return $this->error([], 'Access Denied', 403);
            }
        }

        return parent::render($request, $e);
    }
}
