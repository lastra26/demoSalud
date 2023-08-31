<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSeguimientosTicketTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('seguimientos_ticket', function (Blueprint $table) {
            
            $table->smallIncrements('id')->unsigned();
            //$table->string('folio_seguimiento');
            $table->mediumInteger('ticket_id')->unsigned();
            $table->unsignedSmallInteger('status_seguimiento_id')->index();
            $table->unsignedSmallInteger('area_atencion_id')->index();
            $table->unsignedSmallInteger('tipo_problema_id')->index();
            $table->unsignedSmallInteger('tipo_equipo_id')->unsigned()->index();
            $table->string('descripcion_problema');
            $table->string('observaciones_problema');

            $table->timestamps();
            $table->softDeletes();

        });

        Schema::table('seguimientos_ticket', function($table) {
            $table->foreign('ticket_id')->references('id')->on('tickets');
            $table->foreign('status_seguimiento_id')->references('id')->on('status_seguimiento')->onUpdate('cascade');
            $table->foreign('area_atencion_id')->references('id')->on('catalogo_areas_atencion')->onUpdate('cascade');
            $table->foreign('tipo_problema_id')->references('id')->on('catalogo_tipos_problemas')->onUpdate('cascade');
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
        Schema::dropIfExists('seguimientos_ticket');
    }
}
