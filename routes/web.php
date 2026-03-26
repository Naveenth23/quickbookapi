<?php

use Illuminate\Support\Facades\Route;

// Serve the React application for all routes
Route::view('/{any}', 'app')->where('any', '.*');