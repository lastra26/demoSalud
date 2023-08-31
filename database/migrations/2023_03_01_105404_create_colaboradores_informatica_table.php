<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateColaboradoresInformaticaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('colaboradores_informatica', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->smallInteger('cargo_id')->unsigned()->nullable()->index();
            $table->string('rfc', 13)->comment('Servira para hacer las consultas del Sistematización, para obtener su horario real-actual');;
            $table->string('nombre_completo');
            $table->unsignedSmallInteger('area_atencion_id')->index();
            $table->time('hora_entrada')->comment('Se consumira de Sistematización con su rfc para obtener su horario real-actual');
            $table->time('hora_salida')->comment('Se consumira de Sistematización con su rfc para obtener su horario real-actual');
            
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::table('colaboradores_informatica', function($table) {
            $table->foreign('area_atencion_id')->references('id')->on('catalogo_areas_atencion')->onUpdate('cascade');
            $table->foreign('cargo_id')->references('id')->on('catalogo_cargos')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('colaboradores');
    }
}
