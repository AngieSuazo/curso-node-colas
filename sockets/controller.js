const TicketControl = require("../models/ticket-control");

const ticketControl= new TicketControl(); //Instancia única cada vez que se reinicialice el back

const socketController = (socket) => {
    //Cuando un cliente se conecta
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);

    socket.emit('tickets-pendientes',ticketControl.tickets.length);
 

    
    socket.on('siguiente-ticket', ( payload, callback ) => { //pendientes pero se van a volver a reinicializar
        
        socket.on('siguiente-ticket', (payload, callback) =>{
            const siguiente = ticketControl.siguiente();
            callback(siguiente);
            socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length);

        });

    })

    socket.on('atender-ticket', ({escritorio} ,callback) =>{
        if(!escritorio){
            return callback ({
                ok:false,
                msg:'El escritorio es obligatorio'
            });
        }
        const ticket =ticketControl.atenderTicket(escritorio);

        
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4); //actualiza la pantalla de los últimos 4
        socket.emit('tickets-pendientes',ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length);


        if (!ticket){
            callback({
                ok:false,
                msg:'Ya no hay tickets pendientes'
            });
        }else {
            callback({
                ok:true,
                ticket
            })
        }

    })

}



module.exports = {
    socketController
}

