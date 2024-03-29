type IncidentDTO = {
    client_id: number;
    incident_desc: string;
    city: string;
    country: string;
};
export function createIncidentDTO(client_id: number, incident_desc: string, city: string, country: string): IncidentDTO {
    return {client_id,incident_desc,city,country};
}

// Function to validate Incident DTO
export function validateIncidentDTO(dto : IncidentDTO): boolean{
    // Check if all parameters are provided and of correct types
    if (dto.client_id !== undefined && dto.incident_desc && dto.city && dto.country )
        typeof dto.client_id === 'number' && 
        typeof dto.incident_desc === 'string' &&
        typeof dto.city === 'string' &&
        typeof dto.country === 'string'
    return true
}


  