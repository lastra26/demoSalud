<table>    
    <tbody>
        <tr>
            <th></th><th></th><th></th><th></th>
        </tr>
        <tr>
            <th>DIRECCIÓN</th><td>{{$data['concentrado']->proyecto->direccion->descripcion}}</td><td></td><td></td>
        </tr>
        <tr>
            <th>PROYECTO</th><td>{{$data['concentrado']->proyecto->descripcion}}</td><td></td><td></td>
        </tr>
        <tr>
            <th>ENLACE</th><td>{{$data['enlace']}}</td><td></td><td></td>
        </tr>
        <tr>
            <th>FECHA DE REPORTE</th><td>{{$data['fecha']}}</td><td></td><td></td>
        </tr>
        <tr>
            <th></th><th></th><th></th><th></th>
        </tr>
        <tr>
            <th>N° DE REACTIVOS DEL CHECKLIST</th>
            <th>REACTIVOS N/A</th>
            <th>% DE AVANCE</th>
            <th>PUNTOS O REACTIVOS PENDIENTES</th>
        </tr>
        <tr>
            <td>{{$data['total_checklist_reactivos']}}</td>
            <td>{{$data['respuestas'][0]->total_no_aplica}}</td>
            <td>
                {{ ($data['respuestas'][0]->total_positivos/($data['total_checklist_reactivos'] - $data['respuestas'][0]->total_no_aplica)) }}
            </td>
            <td>
                {{ $data['total_checklist_reactivos'] - ($data['respuestas'][0]->total_no_aplica + $data['respuestas'][0]->total_positivos) }}
            </td>
        </tr>
    </tbody>
</table>