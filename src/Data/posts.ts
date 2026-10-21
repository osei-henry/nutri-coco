export const categories = ['partners', 'health', 'events', 'gallery'] as const
export type Category = (typeof categories)[number]
export type Block = { type: 'heading'; text: string } | { type: 'p'; text: string } | { type: 'image'; src: string; caption?: string } | { type: 'video'; src: string; caption?: string }
export type Post = { slug: string; title: string; date?: string; category: Category; excerpt: string; cover?: string; coverIsVideo?: boolean; content: readonly Block[] }

export const posts: readonly Post[] = [
  { slug: 'fresh-coconut', title: 'Fresh coconut, simply enjoyed', category: 'health', cover: '/Gallery/Coconut.jpeg', excerpt: 'A fresh coconut makes a simple, satisfying tropical moment.', content: [{ type: 'p', text: 'At Nutri Coco, we keep it simple: fresh coconuts, ready to enjoy. Visit us in Airport City or message us to arrange an order.' }, { type: 'image', src: '/Gallery/Coconut.jpeg', caption: 'Fresh coconut from Nutri Coco.' }] },
  { slug: 'coconut-water-lime', title: 'Coconut water with a touch of lime', category: 'gallery', cover: '/Gallery/Tropical%20Coconut%20Refresh%20%F0%9F%A5%A5%F0%9F%8C%B4.jpeg', excerpt: 'Cool coconut water meets a bright touch of lime.', content: [{ type: 'p', text: 'For a bright, refreshing twist, enjoy coconut water with a touch of lime. Send us a WhatsApp message to order.' }, { type: 'image', src: '/Gallery/Tropical%20Coconut%20Refresh%20%F0%9F%A5%A5%F0%9F%8C%B4.jpeg', caption: 'Coconut water with a tropical touch.' }] },
  { slug: 'visit-airport-city', title: 'Find Nutri Coco in Airport City', category: 'events', cover: '/Gallery/Say%20no%20to%20Dehydration.jpeg', excerpt: 'Stop by to buy in person, or contact us to arrange delivery.', content: [{ type: 'p', text: 'Nutri Coco serves fresh coconuts and coconut water with a touch of lime in Airport City, Accra. You can visit in person or message us to arrange delivery.' }, { type: 'image', src: '/Gallery/Say%20no%20to%20Dehydration.jpeg', caption: 'A refreshing coconut moment.' }] },
]
export const sortedPosts: readonly Post[] = posts
export function getPost(slug: string) { return posts.find((post) => post.slug === slug) }
