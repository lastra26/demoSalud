@component('mail::message')
# Confirmación de Nuevo Usuario

Hola {{$user->name}}, para activar tu cuenta y establecer tu contraseña debes hacer click en el siguiente enlace,

@component('mail::button', ['url' => $emailConfirmationUrl])
Click para activar tu cuenta
@endcomponent

Gracias,<br>
{{ config('app.name') }}
@endcomponent
