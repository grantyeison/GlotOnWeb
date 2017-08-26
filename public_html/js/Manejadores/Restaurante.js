/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

    
    
$(document).ready(function () {
    //variables para la conexión con firebase
    var refRestaurantes = firebase.database().ref().child("GlotOn").child("Restaurante");
    var storageRef = firebase.storage().ref().child("GlotOn");
    //variables iniciales
    var tblRestaurantes = document.getElementById("tblRestaurantes");
    var fichero = document.getElementById("ficheroRestaurante");
    //variables auxiliares
    var accionGuardar = "guardar";
    var RestauranteEditar;
    //carga de datos que se encuentran en Firebase
    cargarRegistrosFiBa();
    //inicialización de variables listener
    fichero.addEventListener("change", subirImagen, false);
    
    $('#btnResetRest').click(function(event){
        document.getElementById("DirRest").value = "";
        document.getElementById("DueRest").value = "";
        document.getElementById("NitRest").value = "";
        document.getElementById("NomRest").value = "";
        document.getElementById("TelRest").value = "";
        document.getElementById("LonRest").value = "";
        document.getElementById("LatRest").value = "";
        document.getElementById("LogRest").value = "";
        document.getElementById("btnGuardarRest").value = "Guardar";
        accionGuardar = "guardar";
    });
    
    $('#btnGuardarRest').click(function (event) {
        event.preventDefault();
        var direccion = document.getElementById("DirRest");
        var dueño = document.getElementById("DueRest");
        var nit = document.getElementById("NitRest");
        var nombre = document.getElementById("NomRest");
        var telefono = document.getElementById("TelRest");
        var imagen = document.getElementById("LogRest");
        var longitud = document.getElementById("LonRest");
        var latitud = document.getElementById("LatRest");
        var estado = document.getElementById("EstRest");
        if (accionGuardar === "editar")
        {
            RestauranteEditar.update({
                Direccion: direccion.value,
                Dueño: dueño.value,
                Estado: estado.value,
                Latitud: latitud.value,
                Logo: imagen.value,
                Longitud: longitud.value,
                Nit: nit.value,
                Nombre: nombre.value,
                Telefono: telefono.value
            });
        }
        else if(accionGuardar === "guardar")
        {
            refRestaurantes.push({
                Direccion: direccion.value,
                Dueño: dueño.value,
                Estado: estado.value,
                Latitud: latitud.value,
                Logo: imagen.value,
                Longitud: longitud.value,
                Nit: nit.value,
                Nombre: nombre.value,
                Telefono: telefono.value
            });
        }
        
        direccion.value = "";
        dueño.value = "";
        nit.value = "";
        nombre.value = "";
        telefono.value = "";
        imagen.value = "";
        latitud.value = "";
        longitud.value = "";
        estado.value = "";
        document.getElementById("btnGuardarRest").value = "Guardar";
        accionGuardar = "guardar";
    });
    
    
function cargarRegistrosFiBa()
{
    refRestaurantes.on("value", function(snap){
       var datos = snap.val();
       var filas = "";
       for (var key in datos)
       {
           filas += "<tr>" +
                        "<td>" + datos[key].Nit+ "</td>" +
                        "<td>" + datos[key].Nombre+ "</td>" +
                        "<td>" + datos[key].Dueño+ "</td>" +
                        "<td>" + datos[key].Direccion+ "</td>" +
                        "<td>" + datos[key].Telefono+ "</td>";
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
                        '<td> <button class = "btn btn-info seleccionar" data='+key+'> <span class=" glyphicon glyphicon-ok "></span> </button> </td>' +
                        "<td></td>" +
                   "</tr>";
       }
       console.log(filas);
       tblRestaurantes.innerHTML = filas;
       if (filas !== "")
       {
            elementosBorrables = document.getElementsByClassName("borrar");
            elementosEditables = document.getElementsByClassName("editar");
            elementosSeleccionables = document.getElementsByClassName("seleccionar");
            for (var i=0; i<elementosBorrables.length; i++)
            {
                elementosBorrables[i].addEventListener("click", borrarRestaurante, false);
                elementosEditables[i].addEventListener("click", cargarRestaurante, false);
                elementosSeleccionables[i].addEventListener("click", seleccionarCarta, false);
            }
       }
       
    });
}

function seleccionarCarta()
{
    window.location = "gestionarCaracteristicasPlato.html";
    /*
    var codigoRest = this.getAttribute("data");
    
    objetoInputCodigoRest = document.getElementById("idRest");
      // dar el valor que ha recibido la función
    objetoInputCodigoRest.value = codigoRest;

      // enviar el formulario
    document.formCodRest.submit();*/
}

function cargarRestaurante()
{
    var direccion = document.getElementById("DirRest");
    var dueño = document.getElementById("DueRest");
    var nit = document.getElementById("NitRest");
    var nombre = document.getElementById("NomRest");
    var telefono = document.getElementById("TelRest");
    var imagen = document.getElementById("LogRest");
    var longitud = document.getElementById("LonRest");
    var latitud = document.getElementById("LatRest");
    var estado = document.getElementById("EstRest");
    
    var keyBuscar = this.getAttribute("data");
    RestauranteEditar = refRestaurantes.child(keyBuscar);
    RestauranteEditar.once("value",function(snap){
        var datos = snap.val();
        direccion.value = datos.Direccion;
        dueño.value = datos.Dueño;
        nit.value = datos.Nit;
        nombre.value = datos.Nombre;
        telefono.value = datos.Telefono;
        imagen.value = datos.Logo;
        longitud.value = datos.Longitud;
        latitud.value = datos.Latitud;
        estado.value = datos.Estado;
    });
    document.getElementById("btnGuardarRest").value = "Editar restaurante";
    accionGuardar = "editar";
}

function borrarRestaurante()
{
    var keyBorrar = this.getAttribute("data");
    var RestauranteBorrar = refRestaurantes.child(keyBorrar);
    RestauranteBorrar.remove();
}

    function subirImagen()
    {
        var nombreImagen = document.getElementById("NitRest").value;
        if (nombreImagen === "")
        {
            alert("Debe asignar un nombre al Restaurante");
        }
        else
        {
            //imagen seleccionada con el input
            var imagen = fichero.files[0];
            //linea de código para subir una imagen a firebase, en la carpeta "Restaurante" y con su nombre propio
            var uploadTask = storageRef.child('Restaurante/'+'Logo'+nombreImagen).put(imagen);
            var url = document.getElementById("LogRest");

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

