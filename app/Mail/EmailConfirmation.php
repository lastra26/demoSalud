<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmailConfirmation extends Mailable
{
    use Queueable, SerializesModels;
    public $user;
    public $emailConfirmationUrl;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user,$token){
        $this->user = $user;
        $this->emailConfirmationUrl = config('app.host_client').'establecer-contrasena/'.$token;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build(){
        return $this->markdown('emails.confirmation')->subject('Activar Nuevo Usuario');
    }
}
