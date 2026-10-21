export type Testimonial = { id: string; name: string; role: string; quote: string }
export type GalleryItem = { id: string; caption: string; src?: string; tall?: boolean }

export const testimonials: readonly Testimonial[] = [
  { id: 'brand-1', name: 'Fresh coconuts', role: 'Straightforward goodness', quote: 'Fresh coconuts, ready to enjoy in Airport City.' },
  { id: 'brand-2', name: 'Coconut water', role: 'With a touch of lime', quote: 'Cool coconut water with a bright touch of lime.' },
  { id: 'brand-3', name: 'Nutri Coco', role: 'Delivery or visit', quote: 'Order for delivery or stop by to buy in person.' },
]

export const galleryItems: readonly GalleryItem[] = [
  { id: 'g1', caption: 'Fresh coconut, ready to enjoy', src: '/Gallery/Coconut.jpeg', tall: true },
  { id: 'g2', caption: 'A cool coconut refresh', src: '/Gallery/Tropical%20Coconut%20Refresh%20%F0%9F%A5%A5%F0%9F%8C%B4.jpeg' },
  { id: 'g3', caption: 'Coconut water with a touch of lime', src: '/Gallery/Say%20no%20to%20Dehydration.jpeg' },
  { id: 'g4', caption: 'Fresh tropical coconut', src: '/Gallery/image.png' },
  { id: 'g5', caption: 'A little citrus, a lot of freshness', src: '/Gallery/How%20To%20Make%20The%20Perfect%20Lemon%20Cucumber%20Mint%20Infused%20Water%20At%20Home%20Best%20Organic%20Lemon%20Mint%20Water%20Reci.jpeg', tall: true },
  { id: 'g6', caption: 'Fresh coconut goodness', src: '/Gallery/image1.png' },
]
