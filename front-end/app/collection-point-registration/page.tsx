import CreateCollectionPoint from "@/app/admin/collection-point/registration/page";

export default function CollectionPointRegistrationPage() {
    return <CreateCollectionPoint redirectAfterSuccess="/" initialStatus="PENDENTE" />;
}
