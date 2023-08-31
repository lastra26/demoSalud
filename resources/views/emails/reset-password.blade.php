@component('mail::message')
# Restablecer Contraseña

Estimado {{$user->name}}, hemos recibido una solicitud para restablecer la contraseña de esta cuenta. Solo debes dar click en el siguiente enlace,

@component('mail::button', ['url' => $resetPasswordUrl])
Click para restaurar tu contraseña
@endcomponent

Si no has sido tu quien ha iniciado este proceso, puedes hacer caso omiso de este correo.

Gracias,<br>
{{ config('app.name') }}
@endcomponent
