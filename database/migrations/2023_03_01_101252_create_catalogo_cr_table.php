<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogoCrTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_cr', function (Blueprint $table) {
            $table->string('cr', 15)->primary()->index();
            $table->string('clues', 14);
            $table->string('descripcion');
            $table->string('direccion', 255)->nullable();
            $table->string('cr_dependencia', 15);
            $table->smallinteger('estatus')->default(1)->comment("1->activo, 2->inactivo");
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('catalogo_cr');
    }
}
