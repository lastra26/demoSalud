<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use \Maatwebsite\Excel\Sheet;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

Sheet::macro('styleCells', function (Sheet $sheet, string $cellRange, array $style) {
    $sheet->getDelegate()->getStyle($cellRange)->applyFromArray($style);
});

class ConcentradoDetallesExport implements FromView, WithTitle, WithEvents, WithColumnFormatting
{
    protected $data;

    public function __construct($data){
        $this->data = $data;
    }

    public function view(): View
    {
        return view('exports.concentrado', ['data' => $this->data]);
    }

    public function columnFormats(): array
    {
        return [
            'C' => NumberFormat::FORMAT_PERCENTAGE_00,
        ];
    }

    public function registerEvents(): array{
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $letra = 'A';
                $anchos = [19,27,27,27];
                for ($i=0; $i < count($anchos); $i++) {
                    $event->sheet->getDelegate()->getColumnDimension($letra)->setWidth($anchos[$i]);
                    $letra++;
                }
                $event->sheet->getDelegate()->getStyle('A1:'.($event->sheet->getHighestColumn()).$event->sheet->getHighestRow())->getAlignment()->setWrapText(true);

                $event->sheet->getDelegate()->getRowDimension(3)->setRowHeight(32.3);
                $event->sheet->getDelegate()->mergeCells('B2:'.$event->sheet->getHighestColumn().'2');
                $event->sheet->getDelegate()->mergeCells('B3:'.$event->sheet->getHighestColumn().'3');
                $event->sheet->getDelegate()->mergeCells('B4:'.$event->sheet->getHighestColumn().'4');
                $event->sheet->getDelegate()->mergeCells('B5:'.$event->sheet->getHighestColumn().'5');

                $event->sheet->styleCells(
                    'A7:'.($event->sheet->getHighestColumn()).($event->sheet->getHighestRow()),
                    [
                        'alignment' => [
                            'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
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
                    'A2:A5',
                    [
                        'alignment' => [
                            'vertical' =>  \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP,
                        ],
                        'font' => array(
                            'name'      =>  'Calibri',
                            'size'      =>  10,
                            'bold'      =>  true,
                            'color' => ['argb' => '000000'],
                        )
                    ]
                );

                $event->sheet->styleCells(
                    'A7:'.($event->sheet->getHighestColumn()).'7',
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
        ];
    }

    public function title(): string{
        return 'CONCENTRADO';
    }
}