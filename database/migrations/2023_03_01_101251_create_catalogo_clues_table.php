<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogoCluesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_clues', function (Blueprint $table) {
            $table->string('clues', 14)->primary()->index();
            $table->unsignedSmallInteger('distrito_id')->index();
            $table->string('nombre_unidad')->index();
            $table->string('estatus',191)->nullable();
            $table->string('nivel_atencion',255);
            $table->timestamps();
            $table->softDeletes();
        });

        // Schema::table('catalogo_clues', function($table) {
        //     $table->foreign('distrito_id')->references('id')->on('catalogo_distritos')->onUpdate('cascade');
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('catalogo_clues');
    }
}
