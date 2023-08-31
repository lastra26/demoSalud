<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRelEquipoPersonaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_equipo_persona', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->unsignedSmallInteger('equipo_id')->unsigned();
            $table->unsignedSmallInteger('persona_id')->unsigned()->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('rel_equipo_persona', function($table) {
            $table->foreign('equipo_id')->references('id')->on('equipos_inventario')->onUpdate('cascade');
            $table->foreign('persona_id')->references('sirh_id')->on('personas')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rel_equipo_persona');
    }
}
