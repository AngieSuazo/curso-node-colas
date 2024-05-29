const path=require('path');
const fs =require('fs');

class Ticket {
    constructor(numero, escritorio){
        this.numero=numero;
        this.escritorio=escritorio;
    }
}


class TicketControl{

    constructor(){
        this.ultimo=0; //último ticket que estoy atendiendo por defecto en 0
        this.hoy= new Date().getDate();
        this.tickets=[];
        this.ultimos4=[]; //últimos 4 tickets
        
        
        this.init();
    }

    //Serializar :Generar archivo de las propiedades que quiero grabar
    get toJson (){
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4:this.ultimos4,
        }
    }

    //Inicializar servidor para leer archivo json
    init(){
        const {hoy,tickets,ultimo,ultimos4} =require('../db/data.json');
        if (hoy ==this.hoy){
            this.tickets=tickets;
            this.ultimo=ultimo;
            this.ultimos4=ultimos4;
        }else{
            //es otro día
            this.guardarDB();

        }
    }

    guardarDB(){
        const dbPath=path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    siguiente (){
        this.ultimo +=1; 
        const ticket= new Ticket(this.ultimo, null); //de la clase que creamos Ticket, pide número que va a ser el último atendido y escritorio
        this.tickets.push(ticket); //insertamos al arreglo de tickets

        this.guardarDB();
        return 'Ticket'+ticket.numero;

    }

    atenderTicket(escritorio){
        //No tenemos tickets
        if (this.tickets.length ===0){
            return null;
        }

        const ticket =this.tickets.shift(); //this.tickets[0]; ticket independiente, quitar el primer ticket
        ticket.escritorio=escritorio; //ticket voy a atender
        this.ultimos4.unshift(ticket); //añadir al principio del arreglo

        if(this.ultimos4.length > 4){
           // this.ultimos4.splice(-1,1); //quitar la última posicón del arreglo y que corte 1
            this.ultimos4.splice(4);//deja siempre los 4 primeros sin importar el tamaño del arreglo
        }
        this.guardarDB();

        return ticket;

    }







}

module.exports=TicketControl;