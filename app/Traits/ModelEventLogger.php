<?php

namespace App\Traits;

use App\Models\ActivityLogs;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

/**
 * Class ModelEventLogger
 * @package App\Traits
 *
 *  Automatically Log Add, Update, Delete events of Model.
 */
trait ModelEventLogger {

    /**
     * Automatically boot with Model, and register Events handler.
                $parametros['filtro_detalles'] = json_encode(array_values($parametros['filtro_familias']));
     */
    protected static function bootModelEventLogger()
    {
        foreach (static::getRecordActivityEvents() as $eventName) {
            static::$eventName(function (Model $model) use ($eventName) {
                try {
                    $reflect = new \ReflectionClass($model);
                    return ActivityLogs::create([
                        'fecha_hora'            => Carbon::now(),
                        'usuario_id'            => \Auth::user()->id,
                        'registro_id'           => $model->id,
                        'path_modelo'           => get_class($model),
                        'accion'                => static::getActionName($eventName),
                        'descripcion'           => static::getActionName(ucfirst($eventName)) . " un " . $reflect->getShortName(),
                        'detalles_registro'     => json_encode(array_values($model->getDirty()))
                    ]);
                } catch (\Exception $e) {
                    return true;
                }
            });
        }
    }

    /**
     * Set the default events to be recorded if the $recordEvents
     * property does not exist on the model.
     *
     * @return array
     */
    protected static function getRecordActivityEvents()
    {
        if (isset(static::$recordEvents)) {
            return static::$recordEvents;
        }

        return [
            'created',
            'updated',
            'deleted',
        ];
    }

    /**
     * Return Suitable action name for Supplied Event
     *
     * @param $event
     * @return string
     */
    protected static function getActionName($event)
    {
        switch (strtolower($event)) {
            case 'created':
                return 'Registro';
                break;
            case 'updated':
                return 'Actualizo';
                break;
            case 'deleted':
                return 'Elimino';
                break;
            default:
                return 'Desconocido';
        }
    }
} 