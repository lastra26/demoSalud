<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEquiposInventarioTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('equipos_inventario', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->string('marca');
            $table->string('modelo');
            $table->string('no_serie')->index();
            $table->string('no_inventario')->index();
            $table->boolean('equipo_personal')->default(0)->unsigned()->index();
            $table->unsignedSmallInteger('tipo_equipo_id')->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('equipos_inventario', function($table) {
            $table->foreign('tipo_equipo_id')->references('id')->on('catalogo_tipos_equipo')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('equipos');
    }
}
