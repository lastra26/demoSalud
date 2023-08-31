<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentosCompartidosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('documentos_compartidos', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->unsignedSmallInteger('colaborador_id')->nullable()->index();
			$table->string('tipo', 191)->comment("Si el archivo es: PDF,img,etc.");
			$table->string('url', 191)->comment("ubicación del archivo en el servidor");
			$table->timestamps();
			$table->softDeletes();
        });

        Schema::table('documentos_compartidos', function($table) {
            $table->foreign('colaborador_id')->references('id')->on('colaboradores_informatica')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('documentos');
    }
}
