<?php

namespace App\Traits;

use App\Scopes\BusinessScope;

trait BelongsToBusiness
{
    protected static function bootBelongsToBusiness()
    {
        static::addGlobalScope(new BusinessScope);

        static::creating(function ($model) {

            if (!app()->has('currentBusiness')) {
                abort(403, 'No business context set.');
            }

            $model->business_id = app('currentBusiness')->id;
        });
    }
}