
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";
import { placeholderImages, slugify } from "@/lib/utils";

interface Destination {
	_id: string;
	name: string;
	description?: string;
	image?: string;
	location?: string;
	companyName?: string;
	rating?: number;
	reviews?: number;
	images?: string[];
}

const priceRanges = [
	{ label: "All", value: "" },
	{ label: "Under $100", value: "under100" },
	{ label: "$100 - $500", value: "100to500" },
	{ label: "$500+", value: "over500" },
];
const ratingOptions = [
	{ label: "All", value: "" },
	{ label: "4+ Stars", value: "4plus" },
	{ label: "3+ Stars", value: "3plus" },
];
const sortOptions = [
	{ label: "Popularity", value: "popularity" },
	{ label: "Price: Low to High", value: "priceLow" },
	{ label: "Price: High to Low", value: "priceHigh" },
	{ label: "Rating", value: "rating" },
];

export default function DestinationsPage() {
	const [destinations, setDestinations] = useState<Destination[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [location, setLocation] = useState("");
	const [price, setPrice] = useState("");
	const [rating, setRating] = useState("");
	const [sort, setSort] = useState("popularity");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [filtered, setFiltered] = useState<Destination[]>([]);

	// Keep filtered in sync if no filters applied
	useEffect(() => {
		if (!search && !location && !price && !rating && sort === 'popularity') {
			setFiltered(destinations);
		}
	}, [destinations]);

	useEffect(() => {
		async function load() {
			try {
				setLoading(true);
				setError(null);
				const res = await fetch("/api/destination/list", { cache: "no-store" });
				if (!res.ok) throw new Error("Failed to fetch destinations");
				const data = await res.json();
				let list = data.destinations || [];
				if (!Array.isArray(list)) list = [];
				if (list.length === 0) {
					list = [
						{ _id: 'mock1', name: 'Hunza Valley', description: 'Snow-capped peaks, emerald rivers, and ancient forts.', image: '/images/attabad-lake.jpg', location: 'Gilgit-Baltistan', rating: 4.8, reviews: 152 },
						{ _id: 'mock2', name: 'Skardu Lake', description: 'Mirror lake waters and dramatic mountain silhouettes.', image: '/images/skardu-lake.jpg', location: 'Skardu', rating: 4.7, reviews: 98 },
						{ _id: 'mock3', name: 'K2 Base Camp', description: 'Trek towards the legendary Karakoram giant.', image: '/images/k2-basecamp.jpg', location: 'Karakoram', rating: 4.9, reviews: 210 },
					];
				}
				setDestinations(list);
				setFiltered(list);
			} catch (e:any) {
				setError(e.message);
				setDestinations([]);
				setFiltered([]);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);

	// Featured destination & gallery fallback
	const featured = destinations[0];
	const galleryImages = featured?.images?.length ? featured.images! : placeholderImages;

	const headlineContainer = {
		hidden: {},
		show: { transition: { staggerChildren: 0.12 } }
	};
	const headlineItem = {
		hidden: { y: 18, opacity: 0, scale: 0.98 },
		show: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.6 } }
	};

	return (
		<main className="min-h-screen bg-white text-gray-900">
			<section className="relative w-full min-h-[calc(140vh+340px)] flex flex-col justify-center items-start overflow-hidden">
				{/* Hero Background */}
				<img
					src="/images/altitlg1.jpg"
					alt="Mountain Lake Hero"
					className="absolute inset-0 w-full h-full object-cover object-center"
					style={{ filter: "brightness(0.7)" }}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10" />

				{/* Headline */}
				<motion.div
					className="relative z-20 w-full flex flex-col items-start justify-center text-left mb-170 px-8 max-w-3xl"
					variants={headlineContainer}
					initial="hidden"
					animate="show"
					viewport={{ once: true }}
				>
					<motion.h1 variants={headlineItem} className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg leading-tight">
						Unlock Your Next Adventure<br />In Breathtaking Nature
					</motion.h1>
					<motion.p variants={headlineItem} className="text-2xl text-white/90 mb-8 max-w-xl">
						Discover hidden gems, epic journeys, and unforgettable experiences. Your dream destination is just one click away.
					</motion.p>
				</motion.div>

				<div className="absolute left-1/2 bottom-8 z-30 w-full flex justify-center px-4" style={{ transform: "translateX(-50%)" }}>
					<div className="w-full max-w-6xl px-4">
						<div className="w-full mb-5 text-center">
							<h2 className="text-white text-3xl md:text-4xl font-semibold tracking-tight drop-shadow-md">Explore New Destinations</h2>
							<p className="mt-2 text-white/80 text-sm md:text-base font-light">Curated highlights from our most loved journeys.</p>
						</div>
						<div className="flex gap-8 justify-center items-stretch overflow-x-auto w-full pb-2">
							{loading && (
								[0,1,2].map(i => (
									<div key={i} className="min-w-[320px] max-w-[360px] h-[400px] rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 animate-pulse" />
								))
							)}
							{!loading && filtered.slice(0, 3).map((d, idx) => {
								return (
									<Card
									key={d._id}
									className="min-w-[320px] max-w-[360px] flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden transition-transform hover:shadow-md hover:-translate-y-1 py-0"
									>
										{/* Image (full-bleed) */}
										<div className="w-full h-64 overflow-hidden bg-gray-50 rounded-t-2xl">
											<img
												src={d.image || galleryImages[idx % galleryImages.length]}
												alt={d.name}
												className="w-full h-full object-cover"
											/>
										</div>

										{/* Body */}
										<div className="p-4 flex flex-col gap-3 flex-1">
											<h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{d.name}</h3>
											<p className="text-gray-600 text-sm line-clamp-3">{d.description}</p>
											<div className="mt-auto flex items-center justify-between gap-4">
												<div className="flex items-center gap-3 text-sm text-gray-600">
													<span className="inline-flex items-center gap-1 text-amber-600">
														<Star className="w-4 h-4" />
															<span className="font-medium text-gray-800">{d.rating ?? "-"}</span>
													</span>
													<span className="text-gray-500">{d.location || d.companyName || "Unknown"}</span>
												</div>
													<a href={`/eco-adventure/${slugify(d.name || d.companyName || d._id || 'destination')}`} className="text-sm text-emerald-600 hover:underline">View Details →</a>
											</div>
										</div>
									</Card>
								);
							})}
							{!loading && !error && filtered.length === 0 && (
								<div className="text-white/90 font-medium">No destinations found.</div>
							)}
							{error && (
								<div className="text-red-300 bg-red-600/40 px-3 py-2 rounded-md text-sm">{error}</div>
							)}
						</div>
					</div>
				</div>


			</section>

			{totalPages > 1 && (
				<div className="flex justify-center items-center gap-2 mt-10">
					<Button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 rounded-full">Prev</Button>
					<span className="font-bold text-base">Page {page} of {totalPages}</span>
					<Button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 rounded-full">Next</Button>
				</div>
			)}
		</main>
	);
}
