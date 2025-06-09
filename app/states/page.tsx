import { Country, State } from 'country-state-city';
import Graph3D from '../components/3D-Graph';

export default async function Page() {
    // World Node
    const worldNode = {
        id: 'World',
        group: 0,
        name: 'World',
        flag: "🌍",
    };

    // Country Nodes
    const countryNodes = Country.getAllCountries().map((country) => ({
        id: country.isoCode,
        group: 1,
        name: country.name,
        flag: country.flag,
    }));

    // State Nodes & Links
    let stateNodes: any[] = [];
    let stateLinks: any[] = [];

    countryNodes.forEach(country => {
        const states = State.getStatesOfCountry(country.id);
        states.forEach(state => {
            const stateId = `${country.id}-${state.isoCode}`;
            stateNodes.push({
                id: stateId,
                group: 2,
                name: state.name,
                parentId: country.id,
                countryCode: state.countryCode,
                latitude: state.latitude,
                longitude: state.longitude,
            });
            stateLinks.push({
                source: stateId,
                target: country.id,
            });
        });
    });

    // Combine all nodes and links
    const nodes = [worldNode, ...countryNodes, ...stateNodes];
    const links = [
        ...countryNodes.map(country => ({ source: country.id, target: 'World' })),
        ...stateLinks
    ];

    return (
        <div className="w-full h-screen">
            <div className="hidden lg:block h-full">
                <Graph3D nodes={nodes} links={links} />
            </div>
        </div>
    );
}