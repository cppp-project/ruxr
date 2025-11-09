export class ExtensionCard {
    id: string;
    name: string;
    description: string;
    icon: string;
    first_maintainer: string;
    latest_version: string;
    tags: string[];

    constructor(
        id: string,
        name: string,
        description: string,
        icon: string,
        first_maintainer: string,
        latest_version: string,
        tags: string[] = []
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.first_maintainer = first_maintainer;
        this.latest_version = latest_version;
        this.tags = tags;
    }

    static fromJSON(data: any): ExtensionCard {
        return new ExtensionCard(
            data.id,
            data.name,
            data.description,
            data.icon,
            data['first-maintainer'],
            data['latest-version'],
            data.tags || []
        );
    }

    toJSON(): string {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            description: this.description,
            icon: this.icon,
            'first-maintainer': this.first_maintainer,
            'latest-version': this.latest_version,
            tags: this.tags
        });
    }
}

export type Maintainer = {
    name: string;
    avatar: string;
    homepage: string;
}

export type Version = {
    version: string;
    url: string;
    date: string;
}

export type Dependence = {
    name: string;
    version: string;
    url: string;
    section: string | null;
}

export class FullExtensionInfo {
    id!: string;
    name!: string;
    description!: string;
    icon!: string;
    maintainers!: Maintainer[];
    versions!: Version[];
    license!: string;
    homepage!: string;
    tags!: string[];
    deps!: Dependence[];
    latest_release!: string;

    static fromJSON(data: any): FullExtensionInfo {
        const instance = new FullExtensionInfo();
        instance.id = data.id;
        instance.name = data.name;
        instance.description = data.description;
        instance.maintainers = data.maintainers;
        instance.versions = data.versions.map((v: any) => ({
            version: v.version,
            url: v.url || "",
            date: v.date || "",
        }));
        instance.license = data.license;
        instance.homepage = data.homepage;
        instance.tags = data.tags;
        instance.deps = data.deps.map((d: any) => ({
            name: d.name,
            version: d.version,
            url: d.url || "",
            section: d.section || null,
        }));
        instance.latest_release = data["latest-release"];
        return instance;
    }

    getReadmeUrl(): string {
        return `/pool/${this.id}/README.md`;
    }

    getLicenseUrl(): string {
        return `/pool/${this.id}/LICENSE`;
    }
}

export default {
    ExtensionCard,
    FullExtensionInfo
}
