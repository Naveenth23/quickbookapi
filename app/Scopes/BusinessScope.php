<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class BusinessScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        if (app()->has('currentBusiness')) {
            $builder->where(
                $model->getTable() . '.business_id',
                app('currentBusiness')->id
            );
        }
    }
}