/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

    
    
$(document).ready(function () {
    //variables para la conexión con firebase
    //hasta .ref() obtiene la raiz de la base de datos, de ahí el .child dice que 
    var refRestaurantes = firebase.database().ref().child("GlotOn").child("Restaurante");
    cargarRegistrosFiBa();
    var tblRestaurantes = document.getElementById("tblRestaurantes");
    var accionGuardar = "guardar";
    var RestauranteEditar;
    
    $('#btnResetRest').click(function(event){
        document.getElementById("DirRest").value = "";
        document.getElementById("DueRest").value = "";
        document.getElementById("NitRest").value = "";
        document.getElementById("NomRest").value = "";
        document.getElementById("TelRest").value = "";
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
        var latitud = 0;
        var longitud = 0;
        var imagen = "";
        if (accionGuardar === "editar")
        {
            RestauranteEditar.update({
                Direccion: direccion.value,
                Dueño: dueño.value,
                Estado: 1,
                Latitud: latitud,
                Logo: imagen,
                Longitud: longitud,
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
                Estado: 1,
                Latitud: latitud,
                Logo: imagen,
                Longitud: longitud,
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
                        "<td>" + datos[key].Telefono+ "</td>" +
                        '<td> <button class = "btn btn-danger borrar" data='+key+'> <span class=" glyphicon glyphicon-trash "></span> </button> </td>' +
                        '<td> <button class = "btn btn-info editar" data='+key+'> <span class=" glyphicon glyphicon-pencil "></span> </button> </td>' +
                        "<td></td>" +
                   "</tr>";
       }
       console.log(filas);
       tblRestaurantes.innerHTML = filas;
       if (filas !== "")
       {
            elementosBorrables = document.getElementsByClassName("borrar");
            elementosEditables = document.getElementsByClassName("editar");
            for (var i=0; i<elementosBorrables.length; i++)
            {
                elementosBorrables[i].addEventListener("click", borrarRestaurante, false);
                elementosEditables[i].addEventListener("click", cargarRestaurante, false);
            }
       }
       
    });
}

function cargarRestaurante()
{
    var direccion = document.getElementById("DirRest");
    var dueño = document.getElementById("DueRest");
    var nit = document.getElementById("NitRest");
    var nombre = document.getElementById("NomRest");
    var telefono = document.getElementById("TelRest");
    
    var keyBuscar = this.getAttribute("data");
    RestauranteEditar = refRestaurantes.child(keyBuscar);
    RestauranteEditar.once("value",function(snap){
        var datos = snap.val();
        direccion.value = datos.Direccion;
        dueño.value = datos.Dueño;
        nit.value = datos.Nit;
        nombre.value = datos.Nombre;
        telefono.value = datos.Telefono;
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

});

