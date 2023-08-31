<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRelSeguimientoColaboradoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_seguimiento_colaboradores', function (Blueprint $table) {
            $table->mediumIncrements('id')->unsigned();
            $table->unsignedSmallInteger('seguimiento_id')->index();
            $table->unsignedSmallInteger('colaborador_id')->nullable()->index();
            $table->unsignedSmallInteger('status_seguimiento_id')->index();
            $table->time('tiempo_transcurrido')->comment("se calculara de acuerdo a la hora/fecha del campo created_at");
            $table->dateTime('fecha_inicio');
            $table->dateTime('fecha_fin');
            $table->string('observaciones');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('rel_seguimiento_colaboradores', function($table) {
            $table->foreign('seguimiento_id')->references('id')->on('seguimientos_ticket')->onUpdate('cascade');
            $table->foreign('colaborador_id')->references('id')->on('colaboradores_informatica')->onUpdate('cascade');
            $table->foreign('status_seguimiento_id')->references('id')->on('status_seguimiento')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rel_seguimiento_colaboradores');
    }
}

