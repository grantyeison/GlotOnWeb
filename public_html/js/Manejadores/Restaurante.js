/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

    
    
$(document).ready(function () {
    var refRestaurantes = firebase.database().ref().child("GlotOn").child("Restaurante");
    cargarRegistrosFiBa();
    var tblRestaurantes = document.getElementById("tblRestaurantes");
    
    
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
        direccion.value = "";
        dueño.value = "";
        nit.value = "";
        nombre.value = "";
        telefono.value = "";
    });
    
    
function cargarRegistrosFiBa()
{
    refRestaurantes.on("value", function(snap){
       var datos = snap.val();
       var filas = "";
       for (var key in datos)
       {
           filas += "<tr>" +
                        "<td>" + datos[key].Nit+ "<td>" +
                        "<td>" + datos[key].Nombre+ "<td>" +
                        "<td>" + datos[key].Dueño+ "<td>" +
                        "<td>" + datos[key].Direccion+ "<td>" +
                        "<td>" + datos[key].Telefono+ "<td>" +
                        '<td> <button class = "btn btn-danger borrar" data='+key+'> <span class="glyphicon glyphicon-trash"></span> </button> <td>' +
                        "<td><td>" +
                   "</tr>";
       }
       console.log(filas);
       tblRestaurantes.innerHTML = filas;
       if (filas != "")
       {
            elementosBorrables = document.getElementsByClassName("borrar");
            for (var i=0; i<elementosBorrables.length; i++)
            {
                elementosBorrables[i].addEventListener("click", borrarRestaurante, false);
            }
       }
       
    });
}

function borrarRestaurante()
{
    var keyBorrar = this.getAttribute("data");
    var RestauranteBorrar = refRestaurantes.child(keyBorrar);
    alert (RestauranteBorrar.Nombre);
    //RestauranteBorrar.delete();
}

});

