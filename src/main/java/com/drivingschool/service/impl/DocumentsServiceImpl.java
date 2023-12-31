package com.drivingschool.service.impl;

import com.drivingschool.domain.Documents;
import com.drivingschool.repository.DocumentsRepository;
import com.drivingschool.service.DocumentsService;
import com.drivingschool.service.dto.DocumentsDTO;
import com.drivingschool.service.mapper.DocumentsMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.drivingschool.domain.Documents}.
 */
@Service
@Transactional
public class DocumentsServiceImpl implements DocumentsService {

    private final Logger log = LoggerFactory.getLogger(DocumentsServiceImpl.class);

    private final DocumentsRepository documentsRepository;

    private final DocumentsMapper documentsMapper;

    public DocumentsServiceImpl(DocumentsRepository documentsRepository, DocumentsMapper documentsMapper) {
        this.documentsRepository = documentsRepository;
        this.documentsMapper = documentsMapper;
    }

    @Override
    public DocumentsDTO save(DocumentsDTO documentsDTO) {
        log.debug("Request to save Documents : {}", documentsDTO);
        Documents documents = documentsMapper.toEntity(documentsDTO);
        documents = documentsRepository.save(documents);
        return documentsMapper.toDto(documents);
    }

    @Override
    public DocumentsDTO update(DocumentsDTO documentsDTO) {
        log.debug("Request to update Documents : {}", documentsDTO);
        Documents documents = documentsMapper.toEntity(documentsDTO);
        documents = documentsRepository.save(documents);
        return documentsMapper.toDto(documents);
    }

    @Override
    public Optional<DocumentsDTO> partialUpdate(DocumentsDTO documentsDTO) {
        log.debug("Request to partially update Documents : {}", documentsDTO);

        return documentsRepository
            .findById(documentsDTO.getId())
            .map(existingDocuments -> {
                documentsMapper.partialUpdate(existingDocuments, documentsDTO);

                return existingDocuments;
            })
            .map(documentsRepository::save)
            .map(documentsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DocumentsDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Documents");
        return documentsRepository.findAll(pageable).map(documentsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DocumentsDTO> findOne(Long id) {
        log.debug("Request to get Documents : {}", id);
        return documentsRepository.findById(id).map(documentsMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Documents : {}", id);
        documentsRepository.deleteById(id);
    }
}
