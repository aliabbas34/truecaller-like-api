import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function main(){
    const populateUsers=await prisma.users.createMany({
      data:[
        {
          name:"Suresh raina",
          phoneNumber:"9854652523",
          password:"testpassword123",
          email:"sureshraina@mail.com",
      },
      {
          name:"Ramesh singh",
          phoneNumber:"9813524923",
          password:"testpassword123",
          email:"rameshsingh@mail.com",
      },
      {
          name:"John Doe",
          phoneNumber:"9876543210",
          password:"testpassword123",
          email:"john@example.com",
      },
      {
          name:"Alice Smith",
          phoneNumber:"8765432109",
          password:"testpassword123",
          email:"alice@example.com",
      },
      {
          name:"Bob Johnson",
          phoneNumber:"7654321098",
          password:"testpassword123",
          email:"bob@example.com",
      },
      
      ]
    });
    const populateContacts=await prisma.contacts.createMany({
        data: [
            { name: 'John Doe', phoneNumber: '9876543210', ownerId: 1 },
            { name: 'Alice Smith', phoneNumber: '8765432109', ownerId: 1 },
            { name: 'Bob Johnson', phoneNumber: '7654321098', ownerId: 1 },
            { name: 'Emily Davis', phoneNumber: '6543210987', ownerId: 1 },
            { name: 'Sarah Wilson', phoneNumber: '7987609876', ownerId: 1 },
            { name: 'Michael Brown', phoneNumber: '6321098765', ownerId: 1 },
            { name: 'Olivia Miller', phoneNumber: '8820987654', ownerId: 1 },
            { name: 'Ethan Garcia', phoneNumber: '9898576543', ownerId: 1 },
            { name: 'Ava Martinez', phoneNumber: '9985465432', ownerId: 1 },
            { name: 'Sophia Lee', phoneNumber: '9870654321', ownerId: 1 },
            { name: 'Johnny', phoneNumber: '9876543210', ownerId: 2 },
            { name: 'Smith', phoneNumber: '8765432109', ownerId: 2 },
            { name: 'Bob', phoneNumber: '7654321098', ownerId: 2 },
            { name: 'Abraham', phoneNumber: '6526210987', ownerId: 2 },
            { name: 'Sarah Winston', phoneNumber: '8912109876', ownerId: 2 },
            { name: 'Michael white', phoneNumber: '6328098765', ownerId: 2 },
            { name: 'Olivia Miller', phoneNumber: '5971987654', ownerId: 2 },
            { name: 'Ethan Garcia', phoneNumber: '7894576543', ownerId: 2 },
            { name: 'Ava Martinez', phoneNumber: '6969865432', ownerId: 2 },
            { name: 'Sophia Lee', phoneNumber: '9287654321', ownerId: 2 },
            { name: 'suresh raina', phoneNumber: '7894576543', ownerId: 3 },
            { name: 'Ramesh Singh', phoneNumber: '9813524923', ownerId: 3 },
            { name: 'Sophia', phoneNumber: '9287654321', ownerId: 3 },
            { name: 'Mike', phoneNumber: '6321098765', ownerId: 4 },
            { name: 'Miller', phoneNumber: '8820988843', ownerId: 4 },
            { name: 'Ethan', phoneNumber: '9898574646', ownerId: 4 },
            { name: 'Martinez', phoneNumber: '9985465432', ownerId: 4 },
            { name: 'Ramesh Singh', phoneNumber: '9813524923', ownerId: 5 },
            { name: 'suresh raina', phoneNumber: '9854652523', ownerId: 5 },
            { name: 'jhon', phoneNumber: '9876543210', ownerId: 5 },
            { name: 'mike', phoneNumber: '6321098765', ownerId: 5 },
            { name: 'Peter', phoneNumber: '9896843146', ownerId: 5 },
            { name: 'Martinez', phoneNumber: '9985465432', ownerId: 5 },
        ]
      });

      const populateSpam=await prisma.spam.createMany({
        data:[
            {phoneNumber:'7854625528',spamCount:5,spammedBy:[1,2,3,4,5]},
            {phoneNumber:'8765432109',spamCount:2,spammedBy:[2,3]},
            {phoneNumber:'8820988843',spamCount:4,spammedBy:[2,3,4,5]},
            {phoneNumber:'6321098765',spamCount:5,spammedBy:[1,2,3,4,5]},
            {phoneNumber:'7894576543',spamCount:1,spammedBy:[5]},
        ]
      });
      
}

main();