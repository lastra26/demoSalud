<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPassword extends Mailable
{
    use Queueable, SerializesModels;
    public $user;
    public $resetPasswordUrl;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user,$token){
        $this->user = $user;
        $this->resetPasswordUrl = config('app.host_client').'restablecer-contrasena/'.$token;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build(){
        return $this->markdown('emails.reset-password')->subject('Restablecer Contraseña');
    }
}
