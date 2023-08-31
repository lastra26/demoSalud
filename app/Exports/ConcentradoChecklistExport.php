<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use \Maatwebsite\Excel\Sheet;


Sheet::macro('styleCells', function (Sheet $sheet, string $cellRange, array $style) {
    $sheet->getDelegate()->getStyle($cellRange)->applyFromArray($style);
});

class ConcentradoChecklistExport implements FromCollection, WithEvents, WithTitle
{
    use Exportable;

    protected $rows_titulos = [];
    protected $rows_secciones = [];
    protected $rows_no_aplica = [];

    public function __construct($data){
        //
        $table_data = [
            ['','','','',''],
            ['DOCUMENTOS A INTEGRAR AL EXPEDIENTE DEL PROYECTO AUDITADO','','','',''],
            ['','','','',''],
        ];

        $row_actual = 3;
        $seccion_actual = '';
        foreach ($data->titulos as $titulo) {

            if($titulo->seccion){
                if($titulo->seccion != $seccion_actual){
                    $seccion_actual = $titulo->seccion;
                    $table_data[] = [$seccion_actual,'','','',''];
                    $row_actual++;
                    $this->rows_secciones[] = $row_actual;
                }
            }
            
            $table_data[] = [$titulo->titulo,'','SE CUENTA CON LA INFORMACIÓN','','EN CASO DE QUE HUBIERA SOLICITADO INFORMACÓN Y NO SE CUENTE CON ELLA, MENCIONAR EL AREA  Y FECHA DE SOLICITUD'];
            $row_actual++;

            if($titulo->subtitulo){
                $this->rows_titulos[$row_actual] = 2;

                $table_data[] = [$titulo->subtitulo,'','','',''];
                $row_actual++;
            }else{
                $this->rows_titulos[$row_actual] = 1;
            }

            $table_data[] = ['','','SI','NO',''];
            $row_actual++;
            $control_reactivos_consecutivos = 0;

            foreach ($titulo->reactivos as $reactivo) {
                $row_actual++;
                if($reactivo->no_aplica){
                    $table_data[] = [$reactivo->orden,$reactivo->descripcion,'N/A','N/A','N/A'];

                    if($control_reactivos_consecutivos == $reactivo->id){
                        $this->rows_no_aplica[(count($this->rows_no_aplica)-1)]['conteo'] += 1;
                    }else{
                        $this->rows_no_aplica[] = ['row_inicio'=>$row_actual, 'conteo'=>0];
                    }
                    $control_reactivos_consecutivos = $reactivo->id + 1;
                }else{
                    $table_data[] = [$reactivo->orden,$reactivo->descripcion,($reactivo->tiene_informacion)?'X':'',($reactivo->tiene_informacion)?'':'X',$reactivo->comentarios];
                }
            }

            $table_data[] = ['','','','',''];
            $row_actual++;
        }

        $this->data = $table_data;
    }

    public function registerEvents(): array{
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $letra = 'A';
                $anchos = [5,103,14.7,14.7,55.4];
                for ($i=0; $i < count($anchos); $i++) {
                    $event->sheet->getDelegate()->getColumnDimension($letra)->setWidth($anchos[$i]);
                    $letra++;
                }

                $event->sheet->getDelegate()->mergeCells('A2:'.$event->sheet->getHighestColumn().'2');

                $event->sheet->styleCells(
                    'A2:'.($event->sheet->getHighestColumn()).'2',
                    [
                        'alignment' => [
                            'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                            'vertical' =>  \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                        ],
                        'font' => array(
                            'name'      =>  'Calibri',
                            'size'      =>  11,
                            'bold'      =>  true,
                            'color' => ['argb' => '000000'],
                        )
                    ]
                );

                $event->sheet->styleCells(
                    'A4:'.($event->sheet->getHighestColumn()).($event->sheet->getHighestRow()),
                    [
                        'alignment' => [
                            'vertical' =>  \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                        ],
                        'borders' => [
                            'allBorders' => [
                                'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM,
                                'color' => ['argb' => '666666'],
                            ],
                        ],
                        'font' => array(
                            'name'      =>  'Calibri',
                            'size'      =>  10,
                            'bold'      =>  false,
                            'color' => ['argb' => '000000'],
                        )
                    ]
                );

                $event->sheet->styleCells(
                    'C4:D'.($event->sheet->getHighestRow()),
                    [
                        'alignment' => [
                            'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                        ]
                    ]
                );

                //repetir por cada seccion
                foreach ($this->rows_secciones as $row) {
                    $event->sheet->getDelegate()->mergeCells('A'.$row.':'.$event->sheet->getHighestColumn().$row);
                    $event->sheet->styleCells(
                        'A'.$row.':'.$event->sheet->getHighestColumn().$row,
                        [
                            'alignment' => [
                                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                                'vertical' =>  \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                            ],
                            'fill' => [
                                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                                'color' => ['argb' => 'BBBBBB']
                            ],
                            'font' => array(
                                'name'      =>  'Calibri',
                                'size'      =>  11,
                                'bold'      =>  true,
                                'color' => ['argb' => '000000'],
                            )
                        ]
                    );
                }

                //repetir para cada titulo
                foreach ($this->rows_titulos as $row => $count) {
                    if($count == 1){
                        $event->sheet->getDelegate()->mergeCells('A'.$row.':B'.($row+1));
                        $event->sheet->getDelegate()->mergeCells('C'.$row.':D'.$row);
                        $event->sheet->getDelegate()->getRowDimension($row)->setRowHeight(32.3);
                        $event->sheet->getDelegate()->mergeCells('E'.$row.':E'.($row+1));
                    }else{
                        $event->sheet->getDelegate()->mergeCells('A'.$row.':B'.$row);
                        $event->sheet->getDelegate()->mergeCells('A'.($row+1).':B'.($row+2));
                        $event->sheet->getDelegate()->mergeCells('C'.$row.':D'.($row+1));
                        $event->sheet->getDelegate()->mergeCells('E'.$row.':E'.($row+2));
                    }
                    
                    
                    $event->sheet->styleCells(
                        'A'.$row.':'.($event->sheet->getHighestColumn()).($row+$count),
                        [
                            'alignment' => [
                                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                                'vertical' =>  \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                            ],
                            'fill' => [
                                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                                'color' => ['argb' => 'DDDDDD']
                            ],
                            'font' => array(
                                'name'      =>  'Calibri',
                                'size'      =>  11,
                                'bold'      =>  true,
                                'color' => ['argb' => '000000'],
                            )
                        ]
                    );
                }

                //Agrupar todos los N/A
                foreach ($this->rows_no_aplica as $rows) {
                    $event->sheet->getDelegate()->mergeCells('C'.$rows['row_inicio'].':'.$event->sheet->getHighestColumn().($rows['row_inicio']+$rows['conteo']));
                }
                
                $event->sheet->getDelegate()->getStyle('A1:'.($event->sheet->getHighestColumn()).$event->sheet->getHighestRow())->getAlignment()->setWrapText(true);
            }
        ];
    }

    public function title(): string{
        return 'CHECKLIST';
    }

    public function collection(){
        return collect($this->data);
    }
}