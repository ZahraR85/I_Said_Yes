const Menu = () => {
  const menuItems = [
    {
      category: "Starters",
      items: [
        { name: "Classic Caesar Salad", price: 10 },
        { name: "Tomato & Mozzarella Bruschetta", price: 12 },
        { name: "Vegetable Spring Rolls", price: 11 },
        { name: "Soup of the Day", price: 9 },
        {
          name: "Onion Rings",
          price: 10,
          variants: [
            "Classic",
            "Spicy",
            "Gluten-Free",
            "Keto-Friendly",
            "Kids’ Special",
          ],
        },
        {
          name: "Chicken Wings",
          price: 12,
          variants: ["Classic", "BBQ", "Spicy", "Lemon Pepper", "Honey Garlic"],
        },
        {
          name: "Fish and Chips",
          price: 15,
          variants: [
            "Classic",
            "Gluten-Free Batter",
            "Crispy Fried",
            "Grilled",
            "Low-Fat",
          ],
        },
        {
          name: "Mozzarella Sticks",
          price: 9,
          variants: [
            "Classic",
            "Spicy Marinara",
            "Garlic Parmesan",
            "Herb-Infused",
            "Bite-Size",
          ],
        },
        {
          name: "Stuffed Mushrooms",
          price: 13,
          variants: [
            "Cheese Stuffed",
            "Garlic Butter",
            "Herb & Bacon",
            "Vegan",
            "Gluten-Free",
          ],
        },
        { name: "Garlic Bread with Cheese", price: 8 },
        { name: "Baked Potato Skins", price: 10 },
        { name: "Fried Calamari", price: 14 },
        { name: "Mini Meatballs", price: 13 },
        { name: "Grilled Shrimp Skewers", price: 15 },
        { name: "Buffalo Cauliflower Bites", price: 10 },
        { name: "Stuffed Jalapeños", price: 12 },
        { name: "Caprese Salad", price: 11 },
        { name: "Crab Cakes", price: 16 },
        { name: "Prawn Cocktail", price: 18 },
      ],
    },
    {
      category: "Main Courses",
      items: [
        { name: "Grilled Chicken with Herbs", price: 15 },
        { name: "Beef Stroganoff with Rice", price: 18 },
        { name: "Vegetarian Lasagna", price: 14 },
        { name: "Pan-Seared Salmon with Lemon Butter Sauce", price: 12 },
        { name: "Lamb Chops with Rosemary Sauce", price: 22 },
        {
          name: "Shrimp Alfredo",
          price: 20,
          variants: [
            "Classic",
            "Garlic Parmesan",
            "Spicy",
            "Low-Calorie",
            "Gluten-Free",
          ],
        },
        { name: "Roast Turkey with Cranberry Sauce", price: 19 },
        { name: "BBQ Baby Back Ribs", price: 25 },
        { name: "Stuffed Bell Peppers", price: 16 },
        { name: "Chicken Marsala", price: 18 },
        { name: "Eggplant Parmesan", price: 14 },
        {
          name: "Beef Wellington",
          price: 28,
          variants: ["Classic", "Mushroom-Free", "Spicy Glaze", "Vegetarian"],
        },
        {
          name: "Seafood Paella",
          price: 26,
          variants: ["Classic", "Spicy", "Low-Calorie", "Gluten-Free"],
        },
        { name: "Baked Ziti with Meat Sauce", price: 16 },
        { name: "Herb-Crusted Pork Loin", price: 20 },
        { name: "Vegetarian Stir-Fry", price: 14 },
        { name: "Grilled Tuna Steak", price: 24 },
        { name: "Honey-Glazed Duck Breast", price: 26 },
        { name: "Mushroom Risotto", price: 14 },
        { name: "Spinach and Ricotta Ravioli", price: 16 },
        {
          name: "Chicken Tikka Masala",
          price: 18,
          variants: ["Classic", "Mild", "Spicy", "Gluten-Free"],
        },
        {
          name: "Vegetable Curry",
          price: 16,
          variants: [
            "Classic",
            "Coconut Milk",
            "Spicy",
            "Vegan",
            "Gluten-Free",
          ],
        },
      ],
    },
    {
      category: "Desserts",
      items: [
        { name: "Chocolate Lava Cake", price: 6 },
        { name: "Tiramisu", price: 7 },
        { name: "Fruit Tart", price: 6 },
        { name: "Cheesecake", price: 6 },
        { name: "Panna Cotta with Berry Sauce", price: 8 },
        {
          name: "Chocolate Fudge Cake",
          price: 8,
          variants: [
            "Classic",
            "Sugar-Free",
            "Mini-Portion",
            "Deluxe",
            "Seasonal",
          ],
        },
        {
          name: "Strawberry Cheesecake",
          price: 9,
          variants: [
            "Classic",
            "Gluten-Free",
            "Sugar-Free",
            "Mini-Portion",
            "Seasonal",
          ],
        },
        {
          name: "Ice Cream Sundaes",
          price: 6,
          variants: ["Classic", "Chocolate", "Vanilla", "Fruits Mix", "Deluxe"],
        },
        {
          name: "Tiramisu",
          price: 10,
          variants: [
            "Classic",
            "Gluten-Free",
            "Mini-Portion",
            "Sugar-Free",
            "Deluxe",
          ],
        },
        {
          name: "Crème Brûlée",
          price: 10,
          variants: [
            "Classic",
            "Sugar-Free",
            "Gluten-Free",
            "Mini-Portion",
            "Deluxe",
          ],
        },
        { name: "Carrot Cake", price: 6 },
        { name: "Apple Pie with Vanilla Ice Cream", price: 8 },
        { name: "Peach Cobbler", price: 7 },
        { name: "Brownie Sundae", price: 9 },
        {
          name: "Banoffee Pie",
          price: 8,
          variants: ["Classic", "Gluten-Free", "Sugar-Free", "Deluxe"],
        },
        {
          name: "Macarons",
          price: 6,
          variants: ["Vanilla", "Chocolate", "Pistachio", "Raspberry", "Mix"],
        },
        {
          name: "Gelato",
          price: 7,
          variants: [
            "Vanilla",
            "Chocolate",
            "Stracciatella",
            "Pistachio",
            "Seasonal Fruits",
          ],
        },
        {
          name: "Lemon Meringue Pie",
          price: 7,
          variants: ["Classic", "Mini-Portion", "Gluten-Free", "Sugar-Free"],
        },
        {
          name: "Churros with Chocolate Dip",
          price: 6,
          variants: [
            "Classic",
            "Sugar-Free",
            "Mini-Portion",
            "Cinnamon-Coated",
          ],
        },
        { name: "Raspberry Sorbet", price: 6 },
        {
          name: "Eclairs",
          price: 7,
          variants: ["Chocolate", "Vanilla", "Coffee", "Mix"],
        },
        { name: "Profiteroles", price: 6 },
      ],
    },
    {
      category: "Cold Drinks",
      items: [
        { name: "Assorted Sodas", price: 4 },
        { name: "Mocktails (Variety)", price: 6 },
        {
          name: "Cola",
          price: 3,
          variants: [
            "Classic",
            "Diet",
            "Zero Sugar",
            "Caffeine-Free",
            "Vanilla",
          ],
        },
        {
          name: "Lemonade",
          price: 6,
          variants: ["Classic", "Strawberry", "Mint", "Ginger", "Sugar-Free"],
        },
        {
          name: "Iced Tea",
          price: 5,
          variants: ["Classic", "Peach", "Lemon", "Mango", "Sugar-Free"],
        },
        {
          name: "Fruit Punch",
          price: 6,
          variants: [
            "Classic",
            "Tropical",
            "Berry Blend",
            "Citrus Mix",
            "Low Sugar",
          ],
        },
        {
          name: "Sparkling Water",
          price: 3,
          variants: ["Classic", "Lime", "Orange", "Berry", "Mint"],
        },
        { name: "Fresh Orange Juice", price: 9 },
        { name: "Apple Juice", price: 8 },
        { name: "Pineapple Juice", price: 9 },
        { name: "Mango Juice", price: 10 },
        {
          name: "Smoothies",
          price: 10,
          variants: [
            "Strawberry Banana",
            "Green Detox",
            "Tropical Blend",
            "Berry Mix",
            "Peach Mango",
          ],
        },
        {
          name: "Milkshakes",
          price: 10,
          variants: ["Chocolate", "Vanilla", "Strawberry", "Oreo", "Banana"],
        },
        {
          name: "Cocktails",
          price: 10,
          variants: [
            "Mojito",
            "Margarita",
            "Pina Colada",
            "Cosmopolitan",
            "Bloody Mary",
          ],
        },
        {
          name: "Beer",
          price: 5,
          variants: ["Lager", "Pale Ale", "IPA", "Stout", "Non-Alcoholic"],
        },
        {
          name: "Wine",
          price: 8,
          variants: ["Red", "White", "Rosé", "Sparkling", "Non-Alcoholic"],
        },
        {
          name: "Whiskey",
          price: 10,
          variants: ["Single Malt", "Blended", "Bourbon", "Rye", "Irish"],
        },
        {
          name: "Vodka",
          price: 10,
          variants: ["Classic", "Flavored", "Premium", "Infused", "Sugar-Free"],
        },
        {
          name: "Gin",
          price: 10,
          variants: ["Classic", "Floral", "Citrus", "Herbal", "Spiced"],
        },
        {
          name: "Tequila",
          price: 10,
          variants: ["Blanco", "Reposado", "Añejo", "Gold", "Silver"],
        },
      ],
    },
    {
      category: "Cafe Bar",
      items: [
        { name: "Espresso", price: 4 },
        { name: "Cappuccino", price: 5 },
        { name: "Latte", price: 5 },
        { name: "Americano", price: 4 },
        { name: "Hot Chocolate", price: 6 },
      ],
    },
    {
      category: "Fruits",
      items: [
        { name: "Seasonal Fruit Platter", price: 15 },
        { name: "Exotic Fruit Salad", price: 7 },
        { name: "Chocolate-Dipped Strawberries", price: 8 },
        { name: "Fruit Skewers", price: 6 },
        { name: "Freshly Cut Melons", price: 5 },
        { name: "Mango Slices", price: 6 },
        { name: "Tropical Fruit Bowl", price: 7 },
        { name: "Citrus Medley", price: 5 },
        { name: "Pineapple Coconut Bites", price: 7 },
        { name: "Mixed Berry Parfait", price: 6 },
        { name: "Apple and Pear Slices", price: 4 },
        { name: "Dragon Fruit Salad", price: 8 },
        { name: "Watermelon Chunks", price: 5 },
        { name: "Papaya and Pineapple Salad", price: 7 },
        { name: "Frozen Fruit Pops", price: 6 },
        { name: "Berry Medley with Honey", price: 6 },
      ],
    },
    {
      category: "Cakes",
      items: [
        { name: "Classic Vanilla Cake (per slice)", price: 4 },
        { name: "Rich Chocolate Cake (per slice)", price: 5 },
        { name: "Red Velvet Cake (per slice)", price: 4 },
        { name: "Carrot Cake (per slice)", price: 4 },
        { name: "Cupcakes (Assorted)", price: 2 },
        { name: "Lemon Drizzle Cake (per slice)", price: 3 },
        { name: "Pineapple Upside-Down Cake (per slice)", price: 4 },
        { name: "Chocolate Mousse Cake (per slice)", price: 5 },
        { name: "Peach Cobbler (per slice)", price: 4 },
        { name: "Banoffee Pie (per slice)", price: 5 },
        { name: "Apple Crumble (per slice)", price: 4 },
      ],
    },
    {
      category: "Sweets & Pastries",
      items: [
        { name: "Baklava (per piece)", price: 3 },
        { name: "Knafeh", price: 5 },
        { name: "Ma'amoul Cookies", price: 2 },
        { name: "Turkish Delight", price: 3 },
        { name: "Pistachio Fudge", price: 4 },
        { name: "Basbousa (Semolina Cake)", price: 3 },
        { name: "Kunafa Rolls", price: 5 },
        { name: "Rice Pudding", price: 4 },
        { name: "Baklava with Ice Cream", price: 6 },
        { name: "Chocolate Truffles", price: 5 },
        { name: "Rugelach Pastries", price: 3 },
        { name: "Cinnamon Rolls", price: 4 },
        { name: "Churros with Chocolate Sauce", price: 5 },
      ],
    },
    {
      category: "Waiter Services",
      items: [
        { name: "Table Serving", price: 20 },
        { name: "Buffet Assistance", price: 20 },
        { name: "Beverage Refills", price: 20 },
        { name: "Special Requests Handling", price: 20 },
      ],
    },
  ];

  return (
    <div className="flex justify-center items-start pt-20 min-h-screen bg-[url('./images/catering.png')] bg-contain bg-center ">
      <div className="max-w-full sm:max-w-5xl sm:w-3/5 w-full p-6 sm:p-10 bg-white shadow-2xl rounded-lg space-y-8 ">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-dark-brown">
          Our Full Menu
        </h1>
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h2 className="text-3xl font-semibold text-center text-BgFont mb-5 border-b-4 pb-2">
              {section.category}
            </h2>
            <ul className="space-y-5">
              {section.items.map((item, i) => (
                <li
                  key={i}
                  className="flex flex-col md:flex-row md:justify-between md:px-4 py-3 rounded-lg bg-bgbackground hover:bg-BgPink transition-all duration-300 ease-in-out"
                >
                  <span className="font-semibold text-lg text-BgFont">
                    {item.name}
                  </span>
                  {item.variants && (
                    <div className="mt-2 md:mt-0 text-sm text-BgFont italic">
                      <span>Variants: </span>
                      {item.variants.join(", ")}
                    </div>
                  )}
                  <span className="text-gray-600 font-medium">
                    {item.price}€
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Menu;
