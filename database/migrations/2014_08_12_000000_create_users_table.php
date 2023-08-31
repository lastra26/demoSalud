<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->mediumIncrements('id')->unsigned();

            $table->string('username');
            $table->string('password');
            
            $table->string('name');
            $table->string('email')->unique();
            $table->boolean('is_superuser')->default(false);
            $table->string('avatar')->nullable();

            $table->smallInteger('status')->default(1);

            $table->smallInteger('failed_attempts')->nullable();
            $table->timestamp('last_attempt_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            
            $table->string('action_token',100)->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->timestamps($precision = 0);
            $table->softDeletes();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->string('id', 40)->primary();
            $table->string('description');
            $table->string('group');
            $table->boolean('is_super')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('name');
        });
        Schema::create('role_user', function (Blueprint $table) {
            $table->unsignedInteger('role_id');
            $table->mediumInteger('user_id')->unsigned();

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('role_id')->references('id')->on('roles');
        });

        Schema::create('permission_role', function (Blueprint $table) {
            $table->unsignedInteger('role_id');
            $table->string('permission_id', 40);

            $table->foreign('role_id')->references('id')->on('roles');
        });

        Schema::create('permission_user', function (Blueprint $table) {
            $table->string('permission_id',40);
            $table->mediumInteger('user_id')->unsigned();
            $table->boolean('status');

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('permission_id')->references('id')->on('permissions');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('permission_user');
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('users');
    }
}
