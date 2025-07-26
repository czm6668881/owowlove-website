export const translations = {
  en: {
    // Header
    brand: "sexy cosplay",
    nav: {
      lingerie: "Cosplay"
    },
    
    // Hero Section
    hero: {
      title: "Sexy Cosplay",
      subtitle: "Premium sexy cosplay costumes for women and girls. Discover our exclusive collection of animal costumes, bunny outfits, and fantasy cosplay designs with worldwide shipping."
    },
    
    // Filters
    filters: {
      search: "Search",
      searchPlaceholder: "Search products...",
      size: "Size",
      allSizes: "All Sizes",
      color: "Color", 
      allColors: "All Colors",
      filters: "Filters"
    },
    
    // Products
    products: {
      count: "products",
      featured: "Featured",
      priceLowHigh: "Price: Low to High",
      priceHighLow: "Price: High to Low",
      newest: "Newest",
      highestRated: "Highest Rated",
      addToBag: "Add to Bag"
    },

    // Categories
    categories: {
      shopByCategory: "Shop by Category",
      shopNow: "Shop Now",
      products: "products"
    },

    // Favorites
    favorites: {
      title: "My Favorites",
      empty: {
        title: "No favorites yet",
        description: "Start adding products to your favorites by clicking the heart icon on any product you love.",
        button: "Start Shopping"
      },
      actions: {
        addToCart: "Add to Cart",
        remove: "Remove",
        clearAll: "Clear All",
        confirmClear: "Confirm Clear All",
        continueShopping: "Continue Shopping"
      },
      count: {
        single: "item in your favorites",
        multiple: "items in your favorites"
      },
      addedOn: "Added"
    },

    // Cart
    cart: {
      title: "Shopping Bag",
      empty: "Your bag is empty",
      continueShopping: "Continue Shopping",
      checkout: "Checkout",
      remove: "Remove",
      quantity: "Quantity",
      total: "Total",
      subtotal: "Subtotal"
    },
    
    // Product Names
    productNames: {
      crotchlessLacePanties: "Sexy Crotchless Lace Panties",
      silkBodysuit: "Silk Bodysuit",
      meshBabydoll: "Mesh Babydoll", 
      satinChemise: "Satin Chemise",
      laceBraletteSet: "Lace Bralette Set",
      openCrotchMeshPanties: "Open Crotch Mesh Panties"
    },
    
    // Contact Page
    contact: {
      title: "Contact Us",
      subtitle: "Get in touch with our team",
      description: "We're here to help with any questions about our products, orders, or services.",
      form: {
        name: "Full Name",
        namePlaceholder: "Enter your full name",
        email: "Email Address",
        emailPlaceholder: "Enter your email address",
        subject: "Subject",
        subjectPlaceholder: "What is this regarding?",
        message: "Message",
        messagePlaceholder: "Tell us how we can help you...",
        submit: "Send Message",
        sending: "Sending...",
        success: "Message sent successfully! We'll get back to you soon.",
        error: "Failed to send message. Please try again."
      },
      info: {
        title: "Contact Information",
        email: "Email",
        hours: "Business Hours",
        hoursValue: "Monday - Friday: 9:00 AM - 6:00 PM EST"
      }
    },

    // Shipping Info Page
    shipping: {
      title: "Shipping Information",
      subtitle: "International shipping from China",
      description: "We ship worldwide with fast and reliable delivery options. Please note that estimated shipping times are not guaranteed.",
      international: {
        title: "International Shipping"
      },
      table: {
        area: "Area",
        method: "Method",
        time: "Shipping Time",
        insurance: "Insurance"
      },
      methods: {
        standard: "Standard"
      },
      insurance: {
        yes: "Yes, up to",
        no: "No"
      },
      processing: {
        title: "Processing & Shipping Notes",
        note: "Important",
        description: "Shipping time does not include the 2 business day processing time. Shipping time begins after your order is shipped."
      },
      notes: {
        processing: "Processing time: 2 business days (Monday - Friday)",
        businessDays: "Business days do not include Saturdays, Sundays, or Chinese holidays",
        carriers: "Standard shipping uses reliable postal services",
        origin: "All orders ship from China for affordable international shipping"
      },
      delivery: {
        title: "Delivery Information",
        marked: "For packages marked as delivered but not received, please check with neighbors and contact the shipping company. We cannot cover packages marked as delivered.",
        incorrect: "If a package is returned due to incorrect address, we refund the item cost (shipping excluded). Customer pays new shipping for reship.",
        destroyed: "Please double-check your address. Packages undeliverable due to incorrect address will be destroyed by shipping company. No refund or reship available."
      },
      notice: {
        title: "Important Notice",
        address: "Double-check your shipping address before ordering!",
        delivered: "We cannot replace packages marked as delivered."
      },
      support: {
        title: "Need Help?",
        description: "Have questions about shipping? Our customer service team is here to help.",
        contact: "Contact Support"
      }
    },

    // Footer
    footer: {
      customerService: "Customer Service",
      contactUs: "Contact Us",
      shippingInfo: "Shipping Info",
      returns: "Returns",
      about: "About",
      ourStory: "Our Story",
      press: "Press",
      connect: "Connect",
      instagram: "Instagram",
      facebook: "Facebook",
      newsletter: "Newsletter",
      newsletterText: "Get exclusive offers and updates",
      emailPlaceholder: "Email address",
      subscribe: "Subscribe",
      copyright: "© 2025 OWOWLOVE.COM. All rights reserved."
    }
  }
}

export type Locale = keyof typeof translations
export type TranslationKey = keyof typeof translations.en
