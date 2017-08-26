/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

    
    
$(document).ready(function () {
    //variables para la conexión con firebase
    var refCartas = firebase.database().ref().child("GlotOn").child("Carta");
    var storageRef = firebase.storage().ref().child("GlotOn");
    //variables iniciales
    var tblCartas = document.getElementById("tblCartas");
    //variables auxiliares
    var accionGuardar = "guardar";
    var CartaEditar;
    //carga de datos que se encuentran en Firebase
    cargarRegistrosFiBa();
    
    $('#btnResetCarta').click(function(event){
        document.getElementById("RestCarta").value = "";
        document.getElementById("IngCarta").value = "";
        document.getElementById("PlatoCarta").value = "";
        document.getElementById("DescCarta").value = "";
        document.getElementById("PrecCarta").value = "";
        document.getElementById("EstCarta").value = "";
        document.getElementById("btnGuardarCarta").value = "Guardar";
        accionGuardar = "guardar";
    });
    
    $('#btnGuardarCarta').click(function (event) {
        event.preventDefault();
        var restaurante = document.getElementById("RestCarta");
        var ingredientes = document.getElementById("IngCarta");
        var plato = document.getElementById("PlatoCarta");
        var descripcion = document.getElementById("DescCarta");
        var precio = document.getElementById("PrecCarta");
        var estado = document.getElementById("EstCarta");
        if (accionGuardar === "editar")
        {
            CartaEditar.update({
                Restaurante: restaurante.value,
                Ingredientes: ingredientes.value,
                Estado: estado.value,
                Plato: plato.value,
                Descripcion: descripcion.value,
                Precio: precio.value
            });
        }
        else if(accionGuardar === "guardar")
        {
            refCartas.push({
                Restaurante: restaurante.value,
                Ingredientes: ingredientes.value,
                Estado: estado.value,
                Latitud: latitud.value,
                Logo: imagen.value,
                Longitud: longitud.value,
                Plato: plato.value,
                Descripcion: descripcion.value,
                Precio: precio.value
            });
        }
        
        restaurante.value = "";
        ingredientes.value = "";
        plato.value = "";
        descripcion.value = "";
        precio.value = "";
        imagen.value = "";
        latitud.value = "";
        longitud.value = "";
        estado.value = "";
        document.getElementById("btnGuardarCarta").value = "Guardar";
        accionGuardar = "guardar";
    });
    
    
function cargarRegistrosFiBa()
{
    refCartas.on("value", function(snap){
       var datos = snap.val();
       var filas = "";
       for (var key in datos)
       {
           filas += "<tr>" +
                        "<td>" + datos[key].Plato+ "</td>" +
                        "<td>" + datos[key].Descripcion+ "</td>" +
                        "<td>" + datos[key].Ingredientes+ "</td>" +
                        "<td>" + datos[key].Restaurante+ "</td>" +
                        "<td>" + datos[key].Precio+ "</td>";
                if (datos[key].Logo !== "")
                {
                    filas += "<td>" + "Logo" + "</td>";
                }
                else
                {
                    filas += "<td>" + "" + "</td>";
                }
                        
                filas += "<td>" + datos[key].Latitud+ "</td>" +
                        "<td>" + datos[key].Longitud+ "</td>" +
                        "<td>" + datos[key].Estado+ "</td>" +
                        '<td> <button class = "btn btn-danger borrar" data='+key+'> <span class=" glyphicon glyphicon-trash "></span> </button> </td>' +
                        '<td> <button class = "btn btn-info editar" data='+key+'> <span class=" glyphicon glyphicon-pencil "></span> </button> </td>' +
                        "<td></td>" +
                   "</tr>";
       }
       console.log(filas);
       tblCartas.innerHTML = filas;
       if (filas !== "")
       {
            elementosBorrables = document.getElementsByClassName("borrar");
            elementosEditables = document.getElementsByClassName("editar");
            for (var i=0; i<elementosBorrables.length; i++)
            {
                elementosBorrables[i].addEventListener("click", borrarCarta, false);
                elementosEditables[i].addEventListener("click", cargarCarta, false);
            }
       }
       
    });
}

function cargarCarta()
{
    var restaurante = document.getElementById("RestCarta");
    var ingredientes = document.getElementById("IngCarta");
    var plato = document.getElementById("PlatoCarta");
    var descripcion = document.getElementById("DescCarta");
    var precio = document.getElementById("PrecCarta");
    var imagen = document.getElementById("LogCarta");
    var longitud = document.getElementById("LonCarta");
    var latitud = document.getElementById("LatCarta");
    var estado = document.getElementById("EstCarta");
    
    var keyBuscar = this.getAttribute("data");
    CartaEditar = refCartas.child(keyBuscar);
    CartaEditar.once("value",function(snap){
        var datos = snap.val();
        restaurante.value = datos.Restaurante;
        ingredientes.value = datos.Ingredientes;
        plato.value = datos.Plato;
        descripcion.value = datos.Descripcion;
        precio.value = datos.Precio;
        imagen.value = datos.Logo;
        longitud.value = datos.Longitud;
        latitud.value = datos.Latitud;
        estado.value = datos.Estado;
    });
    document.getElementById("btnGuardarCarta").value = "Editar restaurante";
    accionGuardar = "editar";
}

function borrarCarta()
{
    var keyBorrar = this.getAttribute("data");
    var CartaBorrar = refCartas.child(keyBorrar);
    CartaBorrar.remove();
}

    function subirImagen()
    {
        var nombreImagen = document.getElementById("PlatoCarta").value;
        if (nombreImagen === "")
        {
            alert("Debe asignar un nombre al Carta");
        }
        else
        {
            //imagen seleccionada con el input
            var imagen = fichero.files[0];
            //linea de código para subir una imagen a firebase, en la carpeta "Carta" y con su nombre propio
            var uploadTask = storageRef.child('Carta/'+'Logo'+nombreImagen).put(imagen);
            var url = document.getElementById("LogCarta");

            uploadTask.on('state_changed', function(snapshot){
                //barra de progreso de la subida de la imagen
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
              }
            }, function(error) {
              // gestionar error
              alert("se ha presentado un inconveniente con el proceso de subida");
            }, function() {
              // cuando se ha subido exitosamente la imagen
              var downloadURL = uploadTask.snapshot.downloadURL;
              url.value = downloadURL;
            });
        }
    }

});

