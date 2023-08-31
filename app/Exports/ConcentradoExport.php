<?php 

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ConcentradoExport implements WithMultipleSheets
{
    use Exportable;

    protected $data;
    
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        $sheets = [
            new ConcentradoChecklistExport($this->data['checklist']),
            new ConcentradoDetallesExport($this->data['concentrado'])
        ];
        return $sheets;
    }
}