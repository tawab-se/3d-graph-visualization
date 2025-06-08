import { Country } from 'country-state-city';
import Graph3D from '../components/3D-Graph';


export default async function Page() {
    const worldNode = {
        id: 'World',
        group: 0,
        name: 'World',
        flag: "🌍",
    };

    const countryNodes = Country.getAllCountries().map((country) => ({
        id: country.isoCode,
        group: 1,
        name: country.name,
        currency: country.currency,
        flag: country.flag,
        latitude: country.latitude,
        longitude: country.longitude,
        phonecode: country.phonecode,
        timezones: country.timezones,
        isCountry: true,
        isState: false,
    }));

    const nodes = [worldNode, ...countryNodes];
    const links = countryNodes.map((country) => ({
        source: country.id,
        target: 'World',
    }));

    return (
        <div className="w-full h-screen">
            <div className="hidden lg:block h-full">
                <Graph3D nodes={nodes} links={links} />
            </div>
        </div>
    );
}