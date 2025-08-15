import Image from 'next/image';

interface Logo {
    name: string;
    icon: string;
    business?: {
        name: string;
    };
    alt: string;
    size: number;
    quality?: number;
}

const Logo = () => {
    const logo: Logo = {
        name: 'Assistlore',
        icon: 'Assistlore-logo.jpeg',
        business: {
            name: 'Assistlore',
        },
        alt: 'Logo of My Business',
        size: 50,
        quality: 75,
    };

    return (
        <>
            <a
                href="/"
                title={`View ${logo.icon} logo for ${logo.business?.name}`}
            >
                <Image
                    src="/Assistlore-logo.jpeg"
                    alt={logo.alt}
                    width={logo.size}
                    height={logo.size}
                    priority // Adding priority property for LCP optimization
                    quality={logo.quality}
                />
            </a>
        </>
    );
}

export default Logo;

