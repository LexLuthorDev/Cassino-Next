import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AlertComponent({ title, description }) {
    return (
        <Alert>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    )
}