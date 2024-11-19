import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { Schema, MapSchema, type } from "@colyseus/schema";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}

// An abstract player object, demonstrating a potential 2D world position
export class Player extends Schema {
  @type("number") x: number = 0.11;
  @type("number") y: number = 2.22;
}

// Our custom game state, an ArraySchema of type Player only at the moment
export class State extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

export class GameRoom extends Room<State> {
  // Colyseus will invoke when creating the room instance
  onCreate(options: any) {
    // initialize empty room state
    this.setState(new State());

    // Called every time this room receives a "move" message
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.x += data.x;
      player.y += data.y;
      console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);
    });

    // Called every time this room receives a "move" message
    this.onMessage("back", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.x -= data.x;
      player.y -= data.y;
      console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);
    });
  }

  // Called every time a client joins
  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player());
  }
}
