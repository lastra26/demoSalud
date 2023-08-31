import { LOGOS } from "../../logos";

export class ReporteUsuarios{

    getDocumentDefinition(reportData:any) {
        let fecha_hoy =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date());

        let label_subtitulo:string = 'USUARIOS REGISTRADOS';
        let label_titulo:string = 'CONTROL DE ACCESO';
        
        function numberFormat(num, prices:boolean = false) {
          //return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          var str = num.toString().split(".");
          str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          if(prices){
            return '$ ' +str.join(".");
          }else{
            return str.join(".");
          }
        }

        let datos:any  = {
          pageOrientation: 'portrait',
          pageSize: 'LETTER',
          pageMargins: [ 30, 60, 30, 60 ],
          header: {
            margin: [30, 10, 30, 0],
            table: {
              headerRows: 0,
              widths:[80,'*',80],
              body: [
                [
                  { image: LOGOS[0].LOGO_FEDERAL, alignment:'left', width: 80,  rowSpan:4 },
                  { text:'SECRETARÍA DE SALUD',   style: "encabezado_principal" },
                  { image: LOGOS[1].LOGO_ESTATAL, alignment:'right', width: 60,  rowSpan:4 }
                ],
                [
                  { text:'' },
                  { text: 'PLATAFORMA BASE',        style: "encabezado_principal" },
                  { text:'' },
                ],
                [
                  { text:'' },
                  { text: label_titulo,             style: "encabezado_principal" },
                  { text:'' },
                ],
                [
                  { text:'' },
                  { text: label_subtitulo,          style: "encabezado_principal" },
                  { text:'' },
                ],
                [
                  {
                    colSpan:3,
                    table: {
                      headerRows: 0,
                      widths:['auto','*','auto','auto'],
                      body: [
                        [
                          { text: '',                       style:'detalles_title', colSpan:2},
                          { text: '',                       style:'detalles_datos'},
                          { text: 'Total de Usuarios: ',    style:'detalles_title'},
                          { text: '0',                      style:'detalles_datos'},
                        ],
                      ]
                    },
                    layout: 'noBorders'
                  }
                ]
              ]
            },
            layout: 'noBorders'
          },
          footer: function(currentPage, pageCount) {
            return {
              margin: [30, 20, 30, 0],
              widths:['auto','*','auto'],
              table:{
                headerRows: 0,
                widths:['*','auto','*'],
                body:[
                  [
                    {
                      table: {
                        headerRows: 0,
                        widths:[15,'*'],
                        body: [
                          [
                            { image: LOGOS[2].LOGO_SISTEMA, alignment:'left', width:15 },
                            {
                                text: 'Instituto de Salud - Plataforma Base\n'+location.origin,
                                alignment:'left',
                                noWrap:false,
                                fontSize: 6,
                            },
                          ],
                        ]
                      },
                      layout: 'noBorders'
                    },
                    {
                      text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                      fontSize: 6,
                      alignment: 'center'
                    },
                    {
                      table: {
                        headerRows: 0,
                        heights: [2,10],
                        widths:['*'],
                        body: [
                          [{
                            text: fecha_hoy.toString(),
                            alignment:'right',
                            fontSize: 6,
                          }],
                          [{
                            text: 'Oficinas Centrales',
                            alignment:'right',
                            fontSize: 4,
                          }],
                        ]
                      },
                      layout: 'noBorders'
                    },
                  ]
                ]
              },
              layout: 'noBorders'
            }
          },
          content: [],
          styles: {
            encabezado_detalles:{
              fontSize: 7,
              lineHeight: 0.5,
            },
            encabezado_principal: {
              fontSize: 7,
              bold: true,
              alignment:"center",
              lineHeight: 0.5,
              characterSpacing: 1,
            },
            cabecera: {
              fontSize: 5,
              bold: true,
              fillColor:"#890000",
              color: "white",
              alignment:"center"
            },
            tabla_datos:{
              fontSize: 6
            },
            tabla_datos_center:{
              fontSize: 6,
              alignment: "center"
            },
            tabla_datos_right:{
              fontSize: 6,
              alignment: "right"
            },
            detalles_title:{
              alignment:"right",
              fontSize: 6,
              bold:true,
              noWrap:true,
            },
            detalles_title_center:{
              alignment:"center",
              fillColor:"#DEDEDE",
              fontSize: 6,
              bold:true
            },
            detalles_datos:{
              fontSize: 6
            },
            datos_encabezado_izquierda:{
              fontSize: 8,
              color:"black",
            },
            tabla_encabezado_firmas:{
              fontSize: 8,
              alignment:"center",
              bold:true
            },
            tabla_encabezado_datos:{
              fontSize: 8,
              alignment:"center",
            }
          }
        };

        datos.content.push({
          table: {
            margin: [0,0,0,0],
            widths: ['*','auto','auto','auto','auto','auto','auto','auto','auto'],
            body: []
          },
          //layout:'noBorders',
        });
        
        let encabezado_lista = [
            {text: "#",                         style: 'cabecera'},
            {text: "NOMBRE COMPLETO",           style: 'cabecera'},
            {text: "EMAIL",                     style: 'cabecera'},
            {text: "EMAIL VERIFICADO",          style: 'cabecera'},
            {text: "NOMBRE DE USUARIO",         style: 'cabecera'},
            {text: "ULTIMO INICIO DE SESIÓN",   style: 'cabecera'},
            {text: "ESTATUS",                   style: 'cabecera'},
        ];

        let table_widths = [14, '*', 'auto', 'auto', '*', 'auto','auto'];
        
        datos.content.push({
          table: {
            headerRows:1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: table_widths,
            margin: [0,0,0,0],
            body: [encabezado_lista]
          }
        });
        let index_table = datos.content.length-1;

        let usuarios:any[] = reportData.items;
        let total_usuarios_inactivos:number = 0;
        let total_usuarios_activos:number = 0;
        let total_usuarios_bloqueados:number = 0;
        let total_usuarios_baneados:number = 0;

        let total_usuarios:number = usuarios.length

        for(let i = 0; i < total_usuarios; i++){
            let item  = usuarios[i];

            switch (item.status) {
                case 1:
                    total_usuarios_inactivos += 1;
                    item.estatus_desc = 'Inactivo';
                    break;
                case 2:
                    total_usuarios_activos += 1;
                    item.estatus_desc = 'Activo';
                    break;
                case 3:
                    total_usuarios_bloqueados += 1;
                    item.estatus_desc = 'Bloqueado';
                    break;
                case 4:
                    total_usuarios_baneados += 1;
                    item.estatus_desc = 'Baneado';
                    break;
            }

            item.last_login =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date(item.last_login_at));
            
            if(item.email_verified_at){
                item.email_verified =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date(item.email_verified_at));
            }else{
                item.email_verified = 'Sin Verificar';
            }
            
            let item_pdf = [
                { text: (i+1),                  style: 'tabla_datos_center' },
                { text: item.name,              style: 'tabla_datos'        },
                { text: item.email,             style: 'tabla_datos'        },
                { text: item.email_verified,    style: 'tabla_datos_center' },
                { text: item.username,          style: 'tabla_datos'        },
                { text: item.last_login,        style: 'tabla_datos_center' },
                { text: item.estatus_desc,      style: 'tabla_datos_center' },
            ];

            datos.content[index_table].table.body.push(item_pdf);
        }

        datos.header.table.body[4][0].table.body[0][3].text = numberFormat(total_usuarios);

        datos.content[0].table.body.push(
          [
            {text:'', border: [false, false, false, false]},
            {text: "Inactivos :",                               style: "detalles_title_center"  },
            {text: numberFormat(total_usuarios_inactivos),      style: "detalles_datos"         },
            {text: "Activos :",                                 style: "detalles_title_center"  },
            {text: numberFormat(total_usuarios_activos),        style: "detalles_datos"         },
            {text: "Bloqueados :",                              style: "detalles_title_center"  },
            {text: numberFormat(total_usuarios_bloqueados),     style: "detalles_datos"         },
            {text: "Baneados :",                                style: "detalles_title_center"  },
            {text: numberFormat(total_usuarios_baneados),       style: "detalles_datos"         },
          ],
        );
        datos.content[0].table.body.push([{text:'', colSpan:9, border: [false, false, false, false]}]);
        
        
        if(reportData.config.firmas){
          let firmas = reportData.config.firmas;
          let firmas_etiquetas:any[] = [{ text:'' }];
          let firmas_nombres:any[] = [{ text:'', border:[false,false,false,false] }];
          let firmas_cargos:any[] = [{ text:'', border:[false,false,false,false] }];
          let firmas_widths:any[] = [10];
          let firmas_spaces:any[] = [{ text:'' }];

          firmas.forEach(element => {
            firmas_etiquetas.push({
              text: element.etiqueta,
              style: "tabla_encabezado_firmas"
            },{ text:'' });
            
            firmas_nombres.push({
              text:  element.nombre, 
              style: "tabla_encabezado_datos",
            },{ text:'', border:[false,false,false,false] });

            firmas_cargos.push({
              text:  element.cargo, 
              style: "tabla_encabezado_datos"
            },{ text:'', border:[false,false,false,false] });

            firmas_spaces.push({text:''},{ text:'' });
            firmas_widths.push('*');
            firmas_widths.push(15);
          });

          datos.content.push({
            //layout: 'noBorders',
            layout: {
              hLineWidth: function (i, node) {
                return ( i === node.table.body.length-1) ? 1 : 0;
              },
              vLineWidth: function (i, node) {
                return 0;
              },
            },
            table: {
              dontBreakRows: true,
              heights: [10,'auto', 30, 'auto'],
              widths: firmas_widths,
              margin: [0,0,0,0],
              body: [
                firmas_spaces,
                firmas_etiquetas,
                firmas_spaces,
                firmas_nombres,
                firmas_cargos,
              ]
            }
          });
        }
        return datos;
    }
}