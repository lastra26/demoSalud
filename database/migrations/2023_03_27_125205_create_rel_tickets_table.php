<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRelTicketsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_tickets', function (Blueprint $table) {
            $table->mediumInteger('padre_id')->unsigned();
            $table->mediumInteger('hijo_id')->unsigned();
        });

        Schema::table('rel_tickets', function($table) {
            $table->foreign('padre_id')->references('id')->on('tickets');
            $table->foreign('hijo_id')->references('id')->on('tickets');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rel_tickets');
    }
}
