<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="https://laravel.com/img/notification-logo.png" class="logo" alt="Sistema de Asistencia">
@else
{{ Illuminate\Mail\Markdown::parse($slot) }}
@endif
</a>
</td>
</tr>
