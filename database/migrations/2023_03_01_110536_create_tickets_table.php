<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTicketsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->mediumIncrements('id')->unsigned();
            //$table->string('folio_ticket');
            $table->date('fecha_ticket');
            $table->string('nombre_persona')->nullable();
            $table->unsignedSmallInteger('persona_id')->nullable();
            $table->unsignedSmallInteger('status_ticket_id')->index();
            $table->string('clues_id', 14);
            $table->string('cr_id', 15);
            $table->mediumInteger('user_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('tickets', function($table) {
            $table->foreign('persona_id')->references('sirh_id')->on('personas')->onUpdate('cascade');
            $table->foreign('status_ticket_id')->references('id')->on('status_ticket')->onUpdate('cascade');
            $table->foreign('clues_id')->references('clues')->on('catalogo_clues')->onUpdate('cascade');
            $table->foreign('cr_id')->references('cr')->on('catalogo_cr')->onUpdate('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tickets');
    }
}
