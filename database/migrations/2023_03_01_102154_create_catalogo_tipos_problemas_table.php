<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogoTiposProblemasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_tipos_problemas', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->string('descripcion');    
            $table->smallInteger('area_atencion_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('catalogo_tipos_problemas', function($table) { 
            $table->foreign('area_atencion_id')->references('id')->on('catalogo_areas_atencion')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('catalogo_tipos_problemas');
    }
}
