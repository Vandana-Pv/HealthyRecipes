"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const {
    dialogflow,
    BasicCard,
    Image,
    Table,
    List
} = require("actions-on-google");

const assistant = dialogflow({ debug: true });

app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Default Welcome Intent
assistant.intent("Default Welcome Intent", conv => {
    conv.ask(
        "Hello Welcome to your Healthy Recipe World. Select a category from the following options"
    );
    conv.ask(new List ({
        title: 'List Title',
        items: {
          // Add the first item to the list
          'CoffeeOrTea': {
            synonyms: [
              'Coffee',
              'Coffe',              
              'Cofee',
              'Tea',
              'Tee',
              'T',
            ],
            title: 'Coffee or Tea',
            image: new Image({
              url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
              alt: 'CoffeeOrTea',
            }),
          },
          'BreakFast': {
            synonyms: [
              'Tiffin',
              'Brunch',
          ],
            title: 'BreakFast',
            image: new Image({
              url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
              alt: 'BreakFast',
            }),
          },
          'Lunch': {
            title: 'Lunch',
            image: new Image({
              url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
              alt: 'Lunch',
            }),
          },
          'Snacks': {
            title: 'Snacks',
            image: new Image({
              url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
              alt: 'Snacks',
            }),
          },
          'Dinner': {
            title: 'Dinner',
            image: new Image({
              url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
              alt: 'Dinner',
            }),
          },
        },
    }))
});

assistant.intent('')
assistant.intent('WelcomeResponse', (conv, params, option) => {
    const SELECTED_ITEM_RESPONSES = {
      'CoffeeOrTea': 'You selected Coffee',
      'BreakFast': 'You selected BreakFast',
      'Lunch': 'You selected Lunch',
      'Snacks': 'You selected Snacks',
      'Dinner': 'You selected Dinner',
    };
    conv.ask(SELECTED_ITEM_RESPONSES[option]);
    conv.ask('Which response would you like to see next?');
  });

assistant.intent('RecipeIntent',(conv) =>{
  const recipe = conv.parameters.RecipeName;
  const yesno = conv.parameters.YesOrNo
  if(recipe === 'Chocolate MilkShake'){
    conv.ask(`One glass of chocolate milkshake has 356 calories. 
    Would you like to try the healthy chocolate milkshake
    or go with the regular one`);
    conv.ask(new Table({
      title: 'Chocolate MilkShake',
      dividers: true,
      columns: ['Quantity', 'Name', 'Calories'],
      rows: [
        ['1 Glass', 'Regular Chocolate MilkShake', '356 Calories'],
        ['1 Glass', 'Healthy Chocolate MilkShake', '256 Calories'],
      ]
    }))
  }
  if(yesno === 'Healthy Chocolate Milkshake'){
    conv.ask('Great, Here is the list of ingredients for the Healthy Chocolate MilkShake')
    const ssml =
    '<speak>' +
    ` <say-as interpret-as="fraction"> ¾ </say-as> cup (180g) of plain nonfat Greek yogurt <break time="2" />`+
    ` <say-as interpret-as="fraction">½ </say-as> cup (120mL) of unsweetened cashew or vanilla almond milk <break time="2" />`+
    ` 2 table spoon (10g) of unsweetened cocoa powder <break time="2" />`+
    ` <say-as interpret-as="fraction">¼ </say-as> table spoon vanilla crème stevia OR 1 table spoon (13g) Truvia <break time="2" />`+
    ` 1 cup (130g) ice cubes <break time="2" />`+
    '<speak>'
    conv.ask(new Table({
      title: 'Chocolate MilkShake',
      dividers: true,
      columns: ['Quantity', 'Name'],
      rows: [
        ['¾ Cup', 'Greek yogurt',],
        ['½ Cup', 'Unsweetened Cashew or Vanilla Almond milk'],
        ['2 tbsp', 'Unsweetened Cocoa Powder'],
        ['¼ tbsp / 1 tbsp', 'Vanilla Crème Stevia / Truvia'],
        ['1 Cup', 'Ice Cubes'],
      ]
    }))
    conv.ask(ssml);
  }
  conv.ask('Would you like to know the procedure')
})

assistant.intent('YesIntent', conv => {
    if (!conv.screen) {
    conv.ask(`Add all of the ingredients to a blender in the order listed, and pulse until thick and creamy. Serve immediately.`)
      return;
    }
  
    conv.ask(`Add all of the ingredients to a blender in the order listed, and pulse until thick and creamy. That's it. Tasty Chocolate MilkShake is ready. Would you like to know about any other recipe ?`)
    conv.ask(new BasicCard({
      text: `Add all of the ingredients to a blender in the order listed, and pulse until thick and creamy. Serve immediately.`, 
      title: 'Title: this is a title',
      image: new Image({
        url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
        alt: 'MilkShake',
      }),
      display: 'CROPPED',
    }));
})

assistant.intent('NoIntent', conv =>{
  conv.close('Eat Healthy and be Healthy. See you soon. Bye Bye')
})


// Main Route
app.post("/", assistant);

app.get("/", (req, res) => {
    res.send("server running");
});

app.listen(process.env.PORT || 6000, function () {
    console.log("Express app started on port 6000");
});
