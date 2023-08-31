<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePersonasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('personas', function (Blueprint $table) {
            $table->smallIncrements('sirh_id')->unsigned();
            $table->string('nombre', 191);
            $table->string('apellido_paterno', 191);
            $table->string('apellido_materno', 191);
            // $table->string('telefono_celular');
            // $table->string('correo_electronico');
            $table->string('clues_id', 14);
            $table->string('cr_id', 15);
    
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('personas', function($table) {
            $table->foreign('clues_id')->references('clues')->on('catalogo_clues')->onUpdate('cascade');
            $table->foreign('cr_id')->references('cr')->on('catalogo_cr')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('personas');
    }
}
