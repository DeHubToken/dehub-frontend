import { api } from "@/libs/api";

export async function savePost(tokenId: number, account: string, sig: string, timestamp: number) {
    try {
        const res = await api<{ result: any }>(`/savePost?address=${account?.toLowerCase()}&sig=${sig}&timestamp=${timestamp}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Ensure you're sending JSON
            },
            body: JSON.stringify({ tokenId }), // Convert the body to JSON
        });

        return res;
    } catch (error) {
        console.error("Error saving post:", error);
        throw new Error("Failed to save post");
    }
}
