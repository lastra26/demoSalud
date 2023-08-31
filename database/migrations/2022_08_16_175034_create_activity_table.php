<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateActivityTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            //logger
            $table->id();
            $table->date('fecha_hora');
            $table->bigInteger('usuario_id');
            $table->bigInteger('registro_id');
            $table->string('path_modelo');
            $table->string('accion');
            $table->string('descripcion');
            $table->jsonb('detalles_registro');

            $table->timestamps();
            $table->softDeletes();
        });
        
        Schema::create('sys_log_errors', function (Blueprint $table) {
            $table->id();
            $table->timestamp('created_at')->useCurrent();
            $table->bigInteger('logged_user_id')->index();
            $table->string('ip')->nullable();
            $table->string('url');
            $table->string('method',10);
            $table->text('browser_info')->nullable();
            $table->integer('code')->nullable();
            $table->string('file')->index();
            $table->integer('line')->nullable();
            $table->text('message')->nullable();
            $table->text('trace')->nullable();
            $table->text('parameters')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('sys_log_errors');
    }
}
